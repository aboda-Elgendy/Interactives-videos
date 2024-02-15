<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include "Router.php";

// helper functions  
function  get_question_options($questionId,  $connection ){

    $sql = "SELECT id FROM question_options where question_id = :question_id";
    $stmt = $connection->prepare($sql);
    $stmt->bindParam(':question_id', $questionId);
    $stmt->execute();
    $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return array_values($response);
}

$router = new Router();
$router->addRoute('GET', '/api/videos/:videoID', function ( $videoID, $connection) {
    
    $sql = "SELECT * FROM videos where id = :id";
    $stmt = $connection->prepare($sql);
    $stmt->bindParam(':id', $videoID);
    $stmt->execute();
    $response = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($response);
    exit;
});

$router->addRoute('GET', '/api/videos/:videoID/questions/', function ($videoID , $connection) {
    $sql = "select * , video_questions.id as q_id from video_questions left join question_options
    on video_questions.id = question_options.question_id
    where video_id = :video_id  ";
    $stmt = $connection->prepare($sql);
    $stmt->bindParam(':video_id', $videoID);
    $stmt->execute();
    $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $result  = [];
    foreach ($response as $question) {
        $questionId = $question['q_id'];
        $questionBody = $question['question_body'];
        $time = $question['timestamp'];
        $type = $question['question_type'];
        $time = $question['timestamp'];
    
        if (!array_key_exists($questionId, $result) ) {
            $result[$questionId] = [
                'questionBody' => $questionBody,
                'time' => $time,
                'type' => $type,
                'id' =>  $questionId ,
                'options' => []
            ];
        }
        if ( $type == 1){
        $result[$questionId]['options'][] =  [
            'value' => $question['option_body'],
            'checked' => $question['checked'],
            'optionId' => $question['id'],
        ];
    }
    }
    
    $result = array_values($result);
    
    echo json_encode($result);
    exit;
});

$router->addRoute('POST', '/api/videos/:videoID/questions/', function ($videoID, $connection) {
    $req = json_decode( file_get_contents('php://input') );
    $sql = "INSERT INTO video_questions  ( question_body, video_id, teacher_id, question_type,timestamp) VALUES( :question_body, :video_id, :teacher_id, :question_type , :timestamp )";
    $stmt = $connection->prepare($sql);
    $stmt->bindParam(':question_body', $req->question_body);
    $stmt->bindParam(':video_id', $videoID);
    $stmt->bindParam(':teacher_id', $req->teacher_id);
    $stmt->bindParam(':question_type', $req->question_type);
    $stmt->bindParam(':timestamp', $req->timestamp);
    $exe = $stmt->execute();
    if($exe) {
        if ( $req->question_type == 1 ){
        $recordId = $connection->lastInsertId();
        foreach( $req->options as $option){
            $sql = "INSERT INTO question_options  ( option_body, question_id, checked) VALUES( :option_body, :question_id, :checked)";
            $stmt = $connection->prepare($sql);
            $stmt->bindParam(':option_body', $option->value);
            $stmt->bindParam(':question_id', $recordId);
            $stmt->bindParam(':checked', $option->checked);
            $stmt->execute();
        }

        }
        $response = ['status' => 1, 'message' => 'Record created successfully.'];
    } else {
        $response = ['status' => 0, 'message' => 'Failed to create record.'];
    }
    echo json_encode($response);
    exit;
});


$router->addRoute('PUT', '/api/videos/:videoID/questions/:questionId', function ($videoID, $questionId, $connection) {
    $req = json_decode( file_get_contents('php://input') );
    $sql = "UPDATE  video_questions set  question_body = :question_body , video_id =:video_id , teacher_id=:teacher_id, question_type=:question_type,timestamp =:timestamp where id= :id ";
    $stmt = $connection->prepare($sql);
    $stmt->bindParam(':question_body', $req->question_body);
    $stmt->bindParam(':video_id', $videoID);
    $stmt->bindParam(':teacher_id', $req->teacher_id);
    $stmt->bindParam(':question_type', $req->question_type);
    $stmt->bindParam(':timestamp', $req->timestamp);
    $stmt->bindParam(':id',  $questionId);
    $exe = $stmt->execute();
    if($exe) {
        if ( $req->question_type == 1 ){

        $recordId =  $questionId;
        $options = get_question_options($recordId,$connection);
        $length1 = count($options); 
        $length2 = count($req->options); 
        $min_length = min($length1 , $length2); 
        for( $i = 0 ; $i<$min_length;  $i++){
            $sql = "UPDATE question_options set option_body= :option_body , question_id= :question_id ,  checked = :checked where id = :id";
            $stmt = $connection->prepare($sql);
            $stmt->bindParam(':option_body', $req->options[$i]->value);
            $stmt->bindParam(':id', $options[$i]['id']);
            $stmt->bindParam(':question_id', $recordId);
            $stmt->bindParam(':checked', $req->options[$i]->checked);
            $stmt->execute();
        }
        if($length1> $length2){
            for( $i = $min_length ; $i<$length1;  $i++){

            $sql = "DELETE FROM question_options WHERE id = :id";

            $stmt = $connection->prepare($sql);
            $stmt->bindParam(':id', $options[$i]->id);
            $stmt->execute();

            }
        }else{
            for( $i = $min_length ; $i<$length2;  $i++){

                $sql = "INSERT INTO question_options  ( option_body, question_id, checked) VALUES( :option_body, :question_id, :checked)";
                $stmt = $connection->prepare($sql);
                $stmt->bindParam(':option_body', $req->options[$i]->value);
                $stmt->bindParam(':question_id', $recordId);
                $stmt->bindParam(':checked', $req->options[$i]->checked);
                $stmt->execute();
            }
        }
        
        }
        $response = ['status' => 1, 'message' => 'Record updated  successfully.'];
    } else {
        $response = ['status' => 0, 'message' => 'Failed to create record.'];
    }
    echo json_encode($response);  
      exit;
});


$router->addRoute('DELETE', '/api/videos/:videoID/questions/:questionId', function ($videoID, $questionId,$connection) {
    $sql = "DELETE FROM video_questions WHERE id = :id";

    $stmt = $connection->prepare($sql);
    $stmt->bindParam(':id',  $questionId);

    if($stmt->execute()) {
        $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
    } else {
        $response = ['status' => 0, 'message' => 'Failed to delete record.'];
    }
    echo json_encode($response);
});

$router->addRoute('GET', '/api/videos/:videoID/questions/:questionId/answer', function ($videoID, $questionId,$connection) {
    $sql = "SELECT * FROM question_answers where question_id = :question_id";
    $stmt = $connection->prepare($sql);
    $stmt->bindParam(':question_id', $questionId);
    $stmt->execute();
    $response = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($response);  
    exit;
});
$router->addRoute('POST', '/api/videos/:videoID/questions/:questionId/answer', function ($videoID, $questionId,$connection) {
    $req = json_decode( file_get_contents('php://input') );
    $sql = "INSERT INTO question_answers  ( answer, student_id, question_id, created_at) VALUES( :answer, :student_id, :question_id, :created_at  )";
    $stmt = $connection->prepare($sql);
    $created_at = date('Y-m-d');
    $stmt->bindParam(':answer', $req->answer);
    $stmt->bindParam(':question_id', $questionId);
    $stmt->bindParam(':student_id', $req->student_id);
    $stmt->bindParam(':created_at', $created_at);
    $exe = $stmt->execute();
    if($exe) {
        $response = ['status' => 1, 'message' => 'Answer Created successfully.'];

    }else {
        $response = ['status' => 0, 'message' => 'Failed to Create Answer.'];
    }
    echo json_encode($response);

});

$router->matchRoute();