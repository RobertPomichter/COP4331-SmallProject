<?php
	
	$inData = getRequestInfo(); 	// Getting request info for the contact to be deleted

	$id = $inData["userId"];		// We definitely need the current user's ID
	$phone = $inData["phone"];		// We can just use the contact's unique phone number to identify the contact to be deleted

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "delete from Contacts where UserID = " . $id . " and Phone = " . $phone . "";
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


	//Example insert and delete command:
	// insert into Colors (Name,UserID) VALUES ('Teal',1);
	// delete from Colors where Name = 'Teal';
	// delete from Colors where Name = 'light pink' and UserID = 3;


	// insert into Contacts (UserID, FirstName, LastName, Email, Phone) VALUES (1, 'Josh', 'Test', 'joshtest@test.com', '(123)-456-7890');
	// delete from Contacts where UserID = 1 and Phone = '(123)-456-7890';
?>


