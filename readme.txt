TODO:

KAFKA_EVENTS_RECIEVED, (email_otp) [otpCode, email]
	- pick otpTemplate from db, add otpCode, and send against email.
	


TODO:
Create Seeder for otp email && profile_created email.
Create Apis for SEEDER to seed emails.
Create Seeder for Credentials, and also create api for it.

Email Service: (it will be a separate service with own single db)

. OTP Email: 
	- Generate otp && send email
	- Verify OTP
. Send Confirmation email
. Send reset password email
. Send profile udpated email
. Send booking created/canceled/edit email
.? Send reminders email ??? (kindly elaborate a little bit)

> [Note: the above email will be send as described below]
> [Sending ---> Email service will listen kafka at event ("send_email") --> on event it will send email]
> Also email will be sent through different credentials, depending on country of the user 
> 


Web UI Portal:
. Tracking Following Things:
	. Total Eails Sent
	. Email sent to client
	. Email sent to providers
	. Email sent failed
	. Email Scheduled
. Email Template portal. where email templates will be created/edited/deleted.
. Email Sending Portal:
	. Send to a particular customer a specific email
		. add customer email, subject, select a template or create one. and send to the customer.
	. Send to multiple custoer a specific email
		. add list of customer, subject, select a template or create one. and send to the list of customer.
		
		