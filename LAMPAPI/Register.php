<?php  
	$inData = getRequestInfo(); //request the following info: first name, last name, login, and password

	
	$firstName = $inData["firstName"];	//read in first name
	$lastName = $inData["lastName"];	//read in last name
	$login = $inData["login"];		//read in login
	$password = $inData["password"];	//read in password
	
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//TEST! if any of the fields are empty send an error message and don't insert into DB
		if($firstName === "" || $lastName === "" || $login === "" || $password === "")
		{
			returnWithError("Empty Fields");
		}
		else{
			//insert into Users instead of Colors
			$sql = "insert into Users (firstName,lastName, login, password) VALUES ('" . $firstName . "','" . $lastName . "','".$login."','".$password."')";
			if( $result = $conn->query($sql) != TRUE )
			{
				returnWithError( $conn->error );
			}
			else{
				returnWithError("");
			}
		}
		$conn->close();
	}	
	
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
	

?>
