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
var numContacts = 0;
var didSearch = false;

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
		window.location.href = "contactManager.html";	// redirect user to contactManager.html page
	}
	catch(err)
	{
		// assign error message to loginResult in index.html
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

// TODO: Performs the Register User function using user information captured by register.html
// and by calling the Register.php API endpoint
// Requires User information: firstName, lastName, loginName, loginPassword
function doRegister()
{
	// initialization section
	userId = 0;
	
	var firstName = document.getElementById("firstName").value;	// grab firstName from register.html
	var lastName = document.getElementById("lastName").value;	// grab lastName from register.html
	var login = document.getElementById("loginName").value;	// grab loginName from register.html
	var password = document.getElementById("loginPassword").value;	// grab loginPassword from register.html
//	var hash = md5( password );	// create hashed password using md5.js algorithm
	
	// assigns a register result message TODO: When does this message happen? What should be in it?
	document.getElementById("registerResult").innerHTML = "";

	// JSON package creation - hashed password version
//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';

	// JSON package creation - user's inputted password version
	// Gathers firstName, lastName, loginName, loginPassword
	var jsonPayload = '{"firstName" : "' + firstName +'", "lastName" : "' + lastName + '", "login" : "' + login + '", "password" : "' + password + '"}';

	var url = urlBase + '/Register.' + extension;	// url shortcut variable made to Register.php

	/*
	XML is a a programming tool that uses a language very similar to HTML,
	but is only for handling data storage and transport.
	*/

	// XMLHttpRequests are objects used to communicate with servers.
	// You can access page data without needing to refresh the page,
	// which avoids interrupting the user during their visit.
	var xhr = new XMLHttpRequest();	// constructor to initialize a new XMLHttpRequest (AKA: XHR)

	// Starts the communication request using the POST method, which indicates that data is
	// going to be sent to the Register.php file located at the "url". The Boolean is to specify
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

	// TODO: convert from doLogin() copy paste to doRegister() functionality
	// errors can happen during XHR communication
	try
	{
		xhr.send(jsonPayload);	// sends the communication request (with the JSON data)
				
		//Empty field error messge
		if(firstName === "" || lastName === "" || login === "" || password === ""){
		
			document.getElementById("registerResult").innerHTML = "Please fill all fields";
		}
		else{
			document.getElementById("registerResult").innerHTML = "Registration Successful!";
			
		}
		// TODO: Add an account already exists message section?
		
	}
	// Error if registration communication fails?
	catch(err)
	{
		// assign error message to registerResult in register.html
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function doAddContact()
{
	userId = getUserId();	// extract userId from saved cookie

	// TODO: double check the proper casing for these variables to maintain consistency
	var firstName = document.getElementById("contactFirstName").value;
	var lastName = document.getElementById("contactLastName").value;
	var email = document.getElementById("contactEmail").value;
	var phone = document.getElementById("contactPhone").value;

	// Gathers Contact Information: firstName, lastName, email, phone
	// Gather User Information: userId
	var jsonPayload = '{"userId" : "' + userId + '", "firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "email" : "' + email + '", "phone" : "' + phone + '"}';

	var url = urlBase + '/AddContact.' + extension;	// shortcut to AddContact.php endpoint

	// TODO: figure out if synchronous or asynchronous is preferred in xhr.open
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// TODO: check addColor() for extra statements in the try section and research functionality
	try
	{
		xhr.send(jsonPayload);
		
		if(userId === "" || firstName === "" || lastName === "" || email === "" || phone === ""){
			document.getElementById("addResult").innerHTML = "Please fill all fields";
		}
		else{
			document.getElementById("addResult").innerHTML = "Contact Added!"
		}
		
			
	}
	catch(err)
	{
		document.getElementById("addResult").innerHTML = err.message;
	}
}

function doSearchContacts()
{
	userId = getUserId();
	//var numContacts = 0;
	var i = 0;
	var contactBlock;	// not needed?
	var testMessage = "<span>This is a single contact entry!</span> <br />";

	// TODO: ask what the search contacts input data is formatted like (user inputs into one text field,
	// or user inputs into a firstName field and a lastName field)?

	// if we've already searched, remove all html elements for the currently displayed results
	if (didSearch == true) {
			$( "div" ).remove(".contactEntryBlock");
			$( "span" ).remove(".numContactsMessage");
	}

	var firstName = document.getElementById("searchFirstName").value;
	var lastName = document.getElementById("searchLastName").value;

	// Gather search contact information, put into JSON package
	// User Input gathered: userId, searchFirstName, searchLastName
	var jsonPayload = '{"userId" : "' + userId + '", "firstName" : "' + firstName + '", "lastName" : "' + lastName + '"}';

	var url = urlBase + '/SearchContacts.' + extension;	// shortcut to SearchContacts.php endpoint

	// TODO: figure out if synchronous or asynchronous is preferred in xhr.open
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// TODO: check why the prof's example code includes so many
	try
	{
		xhr.send(jsonPayload);

		// DEBUG: success message for xhr communication and JSON retrieval
		document.getElementById("searchContactsResult").innerHTML = "Contacts Retrieved";

		// JSON response package received, start inserting contact entry information into contactManager.html
		var jsonObject = JSON.parse(xhr.responseText);

		/*
		// TODO: test this, Check for no contacts
		if (err.message == "No Records Found") {
			document.getElementById("searchContactsResult").innerHTML = err.message;
			return;
		}
		*/

		// count number of contacts in list (each content occupies 5 )
		numContacts = jsonObject.results.length / 5;

		// DEBUG: insert new HTML element for displaying number of contacts (THIS WORKS, IS TEDIOUS)
		var numContactsMessage = document.createElement("span");	// create element
		numContactsMessage.setAttribute("class", "numContactsMessage");	// set class
		numContactsMessage.setAttribute("id", "numContactsMessage");	// set id
		numContactsMessage.innerHTML = "You have this many contacts: " + numContacts;	// new way
		var displayResultsSection = document.getElementById("searchContactsResultsStart");	// get the parent element you're adding a child to
		displayResultsSection.appendChild(numContactsMessage);	// add the new child element to the parent element

		// insert the following HTML for each contact
		for (i = 0; i < numContacts; i++) {
			createContactEntryBlock(i);	// create div contact entry block
			populateContactEntry(i);	// fill contact entry block with HTML elements
			assignSearchData(i, jsonObject);	// assign correct search results to each HTML element
		}
	}
	catch(err)
	{
		document.getElementById("searchContactsResult").innerHTML = err.message;
	}

	// Search Completed, set boolean
	didSearch = true;
}

function assignSearchData(entryNumber, jsonObject)
{
	// each contact entry's data takes up 4 jsonObject array slots
	// example: contact 0 is stored in jsonObject[0] - jsonObject[3]
	// ensure the proper indices are used for the correct contact's information

	var startIndex = 0;
	var endIndex = 0;

	// obtain correct indices for the contact's information
	startIndex = entryNumber * 5;
	endIndex = startIndex + 4;

	// use variables as shortcuts to the correct contact's information elements 
	var firstName = document.getElementById("firstNameResult" + entryNumber);
	var lastName = document.getElementById("lastNameResult" + entryNumber);
	var email = document.getElementById("emailResult" + entryNumber);
	var phone = document.getElementById("phoneResult" + entryNumber);
	var contactId = document.getElementById("contactId" + entryNumber);

	// assign search result information to the contact's entry
	firstName.innerHTML = jsonObject.results[startIndex];	// firstName is first in jsonObject
	lastName.innerHTML = jsonObject.results[startIndex + 1];	// lastName is second in jsonObject
	email.innerHTML = jsonObject.results[startIndex + 2];	// phone is third in jsonObject
	phone.innerHTML = jsonObject.results[startIndex + 3];		// email is fourth in jsonObject
	contactId.innerHTML = jsonObject.results[endIndex];		// contact Id is fifth in jsonObject

	// all contact information should be assigned at this point
}

function populateContactEntry(entryNumber)
{
	var searchContactsResults = document.getElementById("searchContactsResultsStart");
	var contactBlock = document.getElementById("contactBlock" + entryNumber);

	// create contactId variable (is not displayed on the page)
	var contactId = document.createElement("span");
	contactId.setAttribute("id", "contactId" + entryNumber);
	contactId.style.display = "none";	// make sure contactId is not displayed or affecting styling
	contactId.innerHTML = "failed to retrieve";
	contactBlock.appendChild(contactId);

	// create FirstName label element
	var firstNameText = document.createElement("span");
	firstNameText.setAttribute("class", "contactInfoText");
	firstNameText.setAttribute("id", "");	// maybe not needed
	firstNameText.innerHTML = "First Name: ";
	contactBlock.appendChild(firstNameText);

	// create FirstName result element
	var firstNameResult = document.createElement("span");
	firstNameResult.setAttribute("class", "contactInfoText");
	firstNameResult.setAttribute("id", "firstNameResult" + entryNumber);
	firstNameResult.innerHTML = "failed to retrieve";
	contactBlock.appendChild(firstNameResult);

	// create & assign a break element
	var newLine = document.createElement("br");
	contactBlock.appendChild(newLine);

	// create LastName label element
	var lastNameText = document.createElement("span");
	lastNameText.setAttribute("class", "contactInfoText");
	lastNameText.setAttribute("id", "");	// maybe not needed
	lastNameText.innerHTML = "Last Name: ";
	contactBlock.appendChild(lastNameText);

	// create LastName result element
	var lastNameResult = document.createElement("span");
	lastNameResult.setAttribute("class", "contactInfoText");
	lastNameResult.setAttribute("id", "lastNameResult" + entryNumber);
	lastNameResult.innerHTML = "failed to retrieve";
	contactBlock.appendChild(lastNameResult);

	// create & assign a break element
	var newLine = document.createElement("br");
	contactBlock.appendChild(newLine);

	// create Phone label element
	var phoneText = document.createElement("span");
	phoneText.setAttribute("class", "contactInfoText");
	phoneText.setAttribute("id", "");	// maybe not needed
	phoneText.innerHTML = "Phone: ";
	contactBlock.appendChild(phoneText);

	// create Phone result element
	var phoneResult = document.createElement("span");
	phoneResult.setAttribute("class", "contactInfoText");
	phoneResult.setAttribute("id", "phoneResult" + entryNumber);
	phoneResult.innerHTML = "failed to retrieve";
	contactBlock.appendChild(phoneResult);

	// create & assign a break element
	var newLine = document.createElement("br");
	contactBlock.appendChild(newLine);

	// create Email label element
	var emailText = document.createElement("span");
	emailText.setAttribute("class", "contactInfoText");
	emailText.setAttribute("id", "");	// maybe not needed
	emailText.innerHTML = "Email: ";
	contactBlock.appendChild(emailText);

	// create Email result element
	var emailResult = document.createElement("span");
	emailResult.setAttribute("class", "contactInfoText");
	emailResult.setAttribute("id", "emailResult" + entryNumber);
	emailResult.innerHTML = "failed to retrieve";
	contactBlock.appendChild(emailResult);

	// create & assign a break element
	var newLine = document.createElement("br");
	contactBlock.appendChild(newLine);

	/* OLD BUTTON DESIGN WITHOUT MODAL
	// create & assign Update button
	var updateButton = document.createElement("button");
	updateButton.setAttribute("class", "contactButton");
	updateButton.setAttribute("id", "updateButton" + entryNumber);
	updateButton.innerHTML = "Update";
	updateButton.setAttribute("onclick", "doUpdateContact()");
	contactBlock.appendChild(updateButton);
	*/

	// NEW BUTTON DESIGN WITH MODAL
	var updateButton = document.createElement("button");
	updateButton.setAttribute("type", "button");
	updateButton.setAttribute("class", "contactButton");
	updateButton.setAttribute("data-target", "#updateModal");
	updateButton.setAttribute("id", "updateButton" + entryNumber);
	updateButton.setAttribute("onclick", "prepareAndShowModal(" + entryNumber + ")");
	updateButton.innerHTML = "Update";
	contactBlock.appendChild(updateButton);

	// create & assign Delete button
	var deleteButton = document.createElement("button");
	deleteButton.setAttribute("class", "contactButton");
	deleteButton.setAttribute("id", "deleteButton" + entryNumber);
	deleteButton.innerHTML = "Delete";
	deleteButton.setAttribute("onclick", "doDeleteContact(" + entryNumber + ")");
	contactBlock.appendChild(deleteButton);
}

function createContactEntryBlock(entryNumber)
{
	// create the new div element with class & id values (id is unique and = entryNumber)
	var contactBlock = document.createElement("div");
	contactBlock.setAttribute("class", "contactEntryBlock");
	contactBlock.setAttribute("id", "contactBlock" + entryNumber);

	// get parent element we're going to assign the new div to
	var displayResultsSection = document.getElementById("searchContactsResultsStart");
	displayResultsSection.appendChild(contactBlock);	// assign div as a child

	// Div Creation Finished

	// populate div element with contact number identifier text
	var contactNumberText = document.createElement("span");
	contactNumberText.setAttribute("class", "contactNumberText");
	contactNumberText.setAttribute("id", "");	// maybe not needed?
	contactNumberText.innerHTML = "Contact #: " + entryNumber;	// new way
	contactBlock.appendChild(contactNumberText);	// DEBUG: could be wrong, assign contact # text to new block

	// create & assign a break element for numContactsMessage
	var newLine = document.createElement("br");
	contactNumberText.appendChild(newLine);
}

// Updates the Contact's information associated with the button's location
// Sends these to Update.php API endpoint: firstName, lastName, email, phone, id, userId
function doUpdateContact()
{
	var entryNumber = document.getElementById("")
	userId = getUserId();	// extract userId from saved cookie

	// gather the user's updated contact information from the modal
	var id = document.getElementById("updateContactId").innerHTML;
	var firstName = document.getElementById("updateFirstName").value;
	var lastName = document.getElementById("updateLastName").value;
	var phone = document.getElementById("updatePhone").value;
	var email = document.getElementById("updateEmail").value;

	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "email" : "' + email + '", "phone" : "' + phone + '", "id" : "' + id + '", "userId" : "' + userId + '"}'

	var url = urlBase + '/Update.' + extension;	// shortcut to Update.php

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);

		// TODO: any response messages likes errors or successes?
	}
	catch(err)
	{
		// TODO: error message
	}

	// TODO: add a section to refresh displayed contact entry's data
	var contactBlockFirstName = document.getElementById("")

	// once update is finished, close modal
	$('#updateModal').modal('hide');
}

// Autofills the input fields of the Update Contact Modal with the contact's current information
// Takes in entryNumber (from the contactBlock the update button is nested into)
function prepareAndShowModal(entryNumber)
{
	// import hidden contactId into modal for Update Contact to reference
	var hiddenContactId = document.getElementById("updateContactId");
	var contactId = document.getElementById("contactId" + entryNumber).innerHTML;
	hiddenContactId.innerHTML = contactId;

	// import hidden entryNumber into modal for Update Contact to reference
	var hiddenEntryNumber = document.getElementById("updateContactEntryNumber");
	hiddenEntryNumber.innerHTML = hiddenEntryNumber;

	// create shortcut variables to input field elements of modal
	var firstNameField = document.getElementById("updateFirstName");
	var lastNameField = document.getElementById("updateLastName");
	var phoneField = document.getElementById("updatePhone");
	var emailField = document.getElementById("updateEmail");

	// assign current contact's information to variables
	var currentFirstName = document.getElementById("firstNameResult" + entryNumber).innerHTML;
	var currentLastName = document.getElementById("lastNameResult" + entryNumber).innerHTML;
	var currentPhone = document.getElementById("phoneResult" + entryNumber).innerHTML;
	var currentEmail = document.getElementById("emailResult" + entryNumber).innerHTML;

	// assign current contact's information to the input field's text to complete Autofill
	// NOTE: setAttribute("value") only alters the default value, not the live value
	// Use element.value = method instead
	firstNameField.value = currentFirstName;
	lastNameField.value = currentLastName;
	phoneField.value = currentPhone;
	emailField.value = currentEmail;

	// show modal
	$('#updateModal').modal('show');
}


function doDeleteContact(entryNumber)
{
	var deleteSuccess = false;
	userId = getUserId();
	alert("Deleting contact entry: " + entryNumber);

	// grab contactId from hidden element inside the entry
	var id = document.getElementById("contactId" + entryNumber).innerHTML;

	// create json package
	var jsonPayload = '{"userId" : "' + userId + '", "id" : "' + id + '"}';

	var url = urlBase + '/Delete.' + extension;	// shortcut to Delete.php endpoint

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);

		// TODO: any response messages likes errors or successes?

		deleteSuccess = true;
	}
	catch(err)
	{
		// TODO: add error message here?
		deleteSuccess = false;
	}

	if (deleteSuccess == true) {
		// delete current set of elements for this contact, it is now deleted so it shouldn't be seen
		// element deletion is not necessary! automatically done for some reason! :D

		// update search results
		doSearchContacts();
	}
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

function getUserId()
{
	// Copied from readCookie()
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

	return userId;
}


// DEBUG ONLY, tests obtaining userId from saved cookie
function doTestUserId()
{
	// Copied from readCookie()
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

	alert("UserId = " + userId);
}
