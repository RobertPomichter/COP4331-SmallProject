/*
	This is the main JavaScript code file, which facilitates the communication
	between the HTML pages and the API.

	JavaScript is a weakly-typed language, so any variable is created using var
	and then assigning it information. The nature of that information defines
	the variable type (so var a = 5; is an integer ... var b = "Text Here" is a string)
*/

var urlBase = 'http://angryredangler.com/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

// Performs the Log In function using user information captured by index.html
// and by calling the Login.php API endpoint. ONLY used in Login Page.
function doLogin()
{
	// initialization section
	userId = 0;	// weird that this isn't ID, it's Id, possible bug source?
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;	// grab loginName from index.html
	var password = document.getElementById("loginPassword").value;	// grab loginPassword from index.html
//	var hash = md5( password );	// create hashed password using md5.js algorithm
	
	// assigns an empty login result message (stays empty if login is successful)
	document.getElementById("loginResult").innerHTML = "";

	// JSON package creation - hashed password version
//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';

	// JSON package creation - user's inputted password version
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';

	var url = urlBase + '/Login.' + extension;	// url shortcut variable made to Login.php

	/*
	XML is a a programming tool that uses a language very similar to HTML,
	but is only for handling data storage and transport.
	*/

	// XMLHttpRequests are objects used to communicate with servers.
	// You can access page data without needing to refresh the page,
	// which avoids interrupting the user during their visit.
	var xhr = new XMLHttpRequest();	// constructor to initialize a new XMLHttpRequest (AKA: XHR)

	// Starts the communication request using the POST method, which indicates that data is
	// going to be sent to the Login.php file located at the "url". The Boolean is to specify
	// the use of synchronous or asynchronous methods.
	xhr.open("POST", url, false);

	/* Sets the parameters of the HTTP Request Header, which is a header section in the HTTP
	   request that defines information about the data that is going to be handled. Here the
	   header's media type (listed as "Content-type"), is being described. The media type is
	   described as an application type with a subtype of JSON, and "charset=UTF-8" describes
	   the set of characters to be used. Charset=UTF-8 is an ASCII alternative character set
	   and is preferred in web page coding.
	*/
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// errors can happen during XHR communication
	try
	{
		xhr.send(jsonPayload);	// sends the communication request (with the JSON data)
		
		// Parse the JSON formatted response string, which has each data element identified
		// by extensions ".id", ".firstName", ".lastName"
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.id;	// extract userID from jsonObject
		
		if( userId < 1 )	// if userID is < 1, no account match in database was found
		{
			// assign error message to loginResult in index.html
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.firstName;	// extract firstName from jsonObject
		lastName = jsonObject.lastName;		// extract lastName from jsonObject

		saveCookie();	// stores firstName, lastName, userId
						// cookie expires after 20 minutes
	
		// TODO: convert to contact manager
		window.location.href = "color.html";	// redirect user to color.html page
	}
	catch(err)
	{
		// assign error message to loginResult in index.html
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

// TODO: Performs the Register User function using user information captured by register.html
// and by calling the Register.php API endpoint
function doRegister()
{
	// copy and pasting doLogin() code to modify
	// initialization section
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;	// grab loginName from register.html
	var password = document.getElementById("loginPassword").value;	// grab loginPassword from register.html
//	var hash = md5( password );	// create hashed password using md5.js algorithm
	
	// assigns a register result message TODO: When does this message happen? What should be in it?
	document.getElementById("registerResult").innerHTML = "";

	// JSON package creation - hashed password version
//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';

	// JSON package creation - user's inputted password version
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';

	var url = urlBase + '/Register.' + extension;	// url shortcut variable made to Register.php
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	var newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	
	var jsonPayload = '{"color" : "' + newColor + '", "userId" : ' + userId + '}';
	var url = urlBase + '/AddColor.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	var colorList = "";
	
	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchColors.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}
