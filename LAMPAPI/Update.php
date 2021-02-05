<?php
	$inData = getRequestInfo();
	
	$id = $inData["id"];
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phone = $inData["phone"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "update Contacts set firstName = '".$firstName."', lastName = '".$lastName."', email = '".$email."', phone = '".$phone."' where ID = ".$id." and userId = ".$userId."";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		$conn->close();
	}
	
	returnWithError("");
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	//update Contacts set firstName = 'Jordan', lastName = 'Collins', email = 'testing@test.com', phone = '123-456-7890' where ID = 1 and userId = 1;
	//update Contacts set firstName = 'Joshua', lastName = 'Test1', email = 'joshtest@gmail.com' where ID = 8 and userId = 1;
?>