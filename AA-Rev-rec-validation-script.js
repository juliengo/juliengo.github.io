/**
* @NModuleScope Public
* @NApiVersion 2.x
*/

define(['./Appf - AC RevRec Configuration Data.js', 'N/search', 'N/format'],
		
	function(configData, search, format) {
	
	function validateVerification(accountIdVal) {
		
		var configAccountObj = configData.mainfunction();
		log.debug('configAccountObj', configAccountObj);
		
		if(_logValidation(accountIdVal) && _logValidation(configAccountObj)) {
			
			var configAccountObj = JSON.parse(configAccountObj);
			var getAllData = configAccountObj.allData;
			
			var isFound = 'F';
			
			for(var a = 0; a < getAllData.length; a++) {
				
				if(getAllData[a].customerInstance == accountIdVal) {
					
					isFound = 'T';
					
					var endDate = getAllData[a].renewalDate;//configAccountObj[accountIdVal];
					log.debug({title: 'endDate', details: endDate});
					
					if(_logValidation(endDate)) {
						
						var getEndDate = parseAndFormatDateString(endDate);
						var sLastDay = getEndDate[0];
						log.debug({title: 'sLastDay', details: sLastDay});
						
						if(sLastDay < new Date()) {
							return false;
							log.debug({title: 'Contract Ended', details: 'Product Contract Ended'});
						}
						
					}
					
				}
				
			}
			
			if(isFound == 'F') {
				
				return false;
				log.debug({title: 'Contract Not Found', details: 'Contract Not Found'});
			}
			
		}
		else if(!_logValidation(accountIdVal) || !_logValidation(configAccountObj)) {
			
			return false;
			log.debug({title: 'Contract Not Found', details: 'Contract Not Found'});
			
		}
		
		return true;
		
	}
	
	function parseAndFormatDateString(initialFormattedDateString) {
		
		var initialFormattedDateString = initialFormattedDateString;
		
		var parsedDateStringAsRawDateObject = format.parse({
			value: initialFormattedDateString,
			type: format.Type.DATE
		});
		
		var formattedDateString = format.format({
			value: parsedDateStringAsRawDateObject,
			type: format.Type.DATE
		});
		
		return [parsedDateStringAsRawDateObject, formattedDateString];
		
	}
	
	function sendExpiryEmail(email, accountIdVal, authorId, scriptName) {
		
		var emailIds = configEmailObj[accountIdVal];
		var endDate = configAccountObj[accountIdVal];
		
		var emailAuthor = authorId;
		var emailReceipients = emailIds;
		var emailSubject = "Appficiency Product - Validity Expired.";
		var emailBody = "";

		emailBody += "Dear User,";
		emailBody += "<br/>";
		emailBody += "<br/>";
		emailBody += "Functionality from below script is expired on date - "+endDate+".";
		emailBody += "<br/>Please contact your Administrator for more details.";
		emailBody += "<br/>";
		emailBody += "<br/>";
		emailBody += "<b>Script Name : </b>"+scriptName+".";
		emailBody += "<br/>";
		emailBody += "<br/>";
		emailBody += "Thank you & Regards,";
		emailBody += "<br/>";
		emailBody += "<b>Appficiency Inc.<b>";
		
		email.send({
			author: emailAuthor,
			body: emailBody,
			recipients: emailReceipients,
			subject: emailSubject
		});
		
	}
	
	function _logValidation(value) {
		if(value != null && value != '' && value != undefined && value.toString() != 'NaN' && value != NaN) {
			return true;
		}
		else {
			return false;
		}
	}
	
	return {
		
		validateVerification : validateVerification,
		sendExpiryEmail : sendExpiryEmail
		
	}
	
});