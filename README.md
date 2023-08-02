# Capstone

This web app is useful for **Human Resource Management** and there are 3 account types:
- Management team(Main/ account type = 1)
- Employees(Employee/ account type = 2)
- Employers(Employer/ account type = 3)

### Management account(ABC Ltd)

For this project, I’m calling them ABC. They can make contracts with employees and employers and register them in the database. Once ABC registered them, they can register themself by going to a page. They can register only with the provided email. Because the system checks if the email is already available in the database. Employees and Employers can’t change their password themself without letting ABC know. Once they contact ABC, they can get a temporary password that asks them to modify as they wish immediately once they logged into the account with the temporary password. ABC can manage employees in the dashboard when employers ask to hire.

### Employee account

Once they logged in, they can see the places where they have to work for including days and times. These are decided by the management team(ABC Ltd).

### Employer account

Employers can list the work so they can use them to request employees for hire by clicking on “Work Arrange”. They have to describe the work and can request the number of employees they are looking for. Once they’ve arranged you can see them on the “Home” page. By clicking on the “Request” button you can make a request by the Management team(ABC). Your requests are visible on their “Dashboard”. You can cancel any request by clicking on “Cancel” on the “Requested” page.

## Functionality 

### Index

The same index function is used for all the account types. But in the template nav and some div s are customized according to the user.

> ##### taskArrange 
>
> is used to list the tasks of the Employer

### Employer account

It works as a single-page application. “Form-work-arrange” is already created using Django templates and visibility is directed by ‘script.js’.

> #### HTML ids:
> 
> ##### Tasks
>
> It contains all the tasks listed by the employer and renders by fetching data using the link ‘tasks/created’ via dataFetch function in the script.js
>
> ##### View-requested
>
> It contains all the requested tasks by the employer and the employer can cancel them anytime. It also uses dataFetch function in ‘script.js’. 
>
> ##### form-work-arrange
>
> It contains the form which use to list the tasks
>
> ##### ‎request-task
>
> It use to request tasks that have been listed by the employer. 



Function dataFetch
	It requires a string that use to fetch data accordingly. According to the input it change the visibility of <div>s and render data.  

	When user clicked on ‘requested’ 
View-requested 
