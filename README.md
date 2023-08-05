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

### Main functions

>### <code>def index</code>
>
> The same index function is used for all the account types. But in the template <code>nav</code> and some <code>div</code>s are customized according to the user.
>
>> ##### <code>name="taskArrange"</code> or <code>prefix="taskArrange"</code>
>>
>> is used to list the tasks of the Employer

> ### `def login_view`
>
> This simply renders the login page and checks the validity

> ### `def logout_view`
>
> When the user clicks on the `Logout` in the `nav`, the user logs out

> ### `def set_password`
>
> This is available only in the **Main account** to reset the password. Once the password is reset it also set `password_reset` to `True` of the user's(Employer/Employee) table. When it is `True`, The users have to use the temporary password provided by the **Main account** to login. Once they logged in, they will get redirected to a page to customize the password. This process is handled by the `def index` and set the user's `password_reset` to `False`

> ### `def register`
>
> This checks if the user that trying to register is already in the database. If so the user can register, else they can't

> ### `def add_employee`
>
> This is available only for the **Main account** to add employees

> ### `def add_employer`
>
> This is also available only for the **Main account** to add employers

> ### `def employees`
>
> This renders a table of employees' information. Available in **Main account** only

> ### `def employers`
>
> This renders a table of employers' information. Available in **Main account** only

> ### `def work_arrange`
>
> This renders all the information about arranged work by the **Main account**. Available in **Main account** only

### APIs

> ### `def available_workers`
>
> This requires a `<int:task_id>` to retrive available employees to hire. Available in **Main account** only

> ### `def connect_workers`
>
> This also requires a `<int:requestWorker_id>` to get the `RequestWorker` model and checks the maximum amount of employees requested by employers. When it filled the required amount sets `RequestWorker.filled` to `True` and saves the data. Available in **Main account** only

> ### `def cancel_workarrange`
>
> If the request is `DELETE`, it deletes the data from `RequestWorker` model, and if the request is `PUT`(available only in **Main account**), it removes all the connected employees to the employer request.

> ### `def cancel-task`
>
> It requires a `DELETE` request and deletes the tasks requested by the employer(Available only in **Employer account**).

> ### `def worker`
>
> Request all the tasks that the employee has relationships with 




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

## Distinctiveness and complexity

The index function handles three types of accounts and renders according to the account type. It also checks whether the user is logged in with a temporary password or not. If so it redirects the user to choose a new password. 

In this project, resetting passwords follows a different process than how we usually do. When the user needs to reset it, he or she has to inform the Main account holders(HR Management). So they provide a temporary password to log in and after that users get immediately redirected to a page where they can choose their own. 

The most challenging part was creating the `def available_workers`. In this case, I used multiple querying. For that, I used `Q`. When the **Main account** clicks to `Arrange` a request of workers, the available workers haven't been included in any other work during that requested time period. This took me several days to figure out and completely implemented the function. During that, I focused on other implementations too. 

The next part was `connect_workers`. I used `set` to connect multiple workers for the first time. But then I realized that I can not add later a worker if the first time I added 2 workers but which requires 3 workers to work. So I used for loop and used `add` to add workers. The next problem was identifying the requested workers if they haven't filled with the required amount of workers. So I used Bootstrap background colors and a warning message

This is not a part of the project but this took me 2 months to finish and I have more ideas to add as features in **Employee account**. During this time I had to have a replacement operation on my knee and femur and for that, I had to have chemical therapies since April 2022.



