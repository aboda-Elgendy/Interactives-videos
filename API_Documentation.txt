# Interactive_video_player
Interactive video player with React and PHP 

current app has the following routes 

1- get video by id 
method -> 'GET',
URl-> '{BaseUrl}/api/videos/:videoID', 
response schema : 
{
video_id, 
video_url
}

2- get all the questions 
method -> 'GET',
URl-> '{BaseUrl}'/api/videos/:videoID/questions/', 
response schema : 
[
{
"questionBody":"what is analog hour consists from? "
,"time":41,
"type":2, 
"id":11,
"options":[]
}]

4- post question per video current timestamp during video progress 
method -> 'POST',
URl-> '{BaseUrl}'/api/videos/:videoID/questions/', 
request schema : 
{
question_body,
teacher_id,
question_type,
timestamp
}
response schema : 
in case of success 
{
'status' => 1, 'message' => 'Record created successfully.'
}
in case failure 
{
'status' => 0, 'message' => 'Failed to create record.'
}

5- Update questionbody and options if founnd during video progrss
method -> 'PUT',
URl-> '{BaseUrl}'/api/videos/:videoID/questions/questionID', 
request schema : 
{
question_body,
teacher_id,
question_type,
timestamp
}
response schema : 
in case of success 
{
'status' => 1, 'message' => 'Record updated successfully.'
}
in case failure 
{
'status' => 0, 'message' => 'Failed to update record.'
}
