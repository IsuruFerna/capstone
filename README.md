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

>### <code>def index</code>
>
> The same index function is used for all the account types. But in the template <code>nav</code> and some <code>div</code>s are customized according to the user.
>
>> ##### <code>name="taskArrange"</code> or <code>prefix="taskArrange"</code>
>>
>> is used to list the tasks of the Employer

### Employer account

It works as a single-page application. “Form-work-arrange” is already created using Django templates and visibility is directed by <code>script.js</code>.

> #### HTML ids:
> 
>> ##### <code>id="tasks"</code>
>>
>> It contains all the tasks listed by the employer and renders by fetching data using the link [tasks/created]() via <code>dataFetch(view)</code> function in the script.js
>
>> ##### <code>id="view-requested"</code>
>>
>> It contains all the requested tasks by the employer and the employer can cancel them anytime. It also uses <code>dataFetch(view)</code> function in <code>script.js</code> 
>
>> ##### <code>id="form-work-arrange"</code>
>>
>> It contains the form which use to list the tasks
>
>> ##### <code>id="‎request-task"</code>
>>
>> It uses to request tasks that have been listed by the employer. 


> #### JavaScript functions
> 
>> ##### <code>function dataFetch(view)</code>
>> 
>> It requires a string that use to fetch data according to the input. It changes the visibility of <code>div</code>s to <code>block</code> or <code>none</code> and renders data. Inside the <code>dataFetch(view)</code> function there are 3 other functions that help to **render**, **request** and **cancel** tasks  
>>
>>> ##### <code>renderTasks(dataHome, taskContainer)</code>
>>> 
>>> This renders all the created  task to <code>id="view-requested"</code>
>>>
>>
>>> ##### `requestTask(containerCreatedTasks)`
>>>
>>> When the user clicks on `<button id="requestBtn">Request</button>` a class called `show` is added to `id="toast"` and becomes visible. On this `form` user can add dates and times and also modify the data. By clicking on `<button name="requestWorkers">Request</button>` saves data to the `RequestWorker` model through `def index`
>>
>>> ##### `cancel_task(containerRequestedTasks, action)`
>>>
>>> By clicking on any `cancel` button, this function calls and deletes them immediately from the database. This function is originally located in the `pack.js`

### Employee account

> #### HTML ids:
>
>> ##### `id="view-employee"`
>>
>> It shows a list of work that the employee has to attend which fetches data via `script.js`

### Main account/ Management Account

> #### HTML ids:
>
>> ##### `id="view-dashboard"`
>>
>> On this `div` renders all the requested employee details by employers. When the user clicks on `<button id="btnArrange">Araange</button>`, it copies the data and puts it into `<div id="view-workArrange-info"></div>` and renders at the left side of the `id="view-workArrange"` and the right side `<form id="view-available-workers"></form> Which contains available workers via fetching [task/task_id]().
>
>> ##### id="view-workArrange-info"
>>
>> On this `div` renders the information about the employer 

> #### JavaScript functions
>
>>  
