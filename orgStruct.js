// Author: Kevin Pillsbury
// File name: orgStruct.js
// Date: 1/7/25
// Desc: System for keeping track of employees
// Author's notes: There's a good amount of error checking in this. It's not totally foolproof,
// for example you could make an employee their, own manager. That's one thing I've discovered,
// I'm sure there are more ways to break it, but it's not worth my time fixing them.

// RUN FILE WITH: node orgStruct.js

class Employee {
    #id;
    #name;
    #manager;
    #reports;

    constructor(id, name, manager = null) {
        this.#id = id;
        this.#name = name;
        this.#manager = manager;
        this.#reports = [];
    }

    
    // Adder/Remover/Getter: reports
    addReport(report) {
        this.#reports.push(report);
    }

    addReports(reports) {
        this.#reports.push(...reports);
    }

    removeReport(report) {
        for (let i = 0; i < this.#reports.length; i++) {
            if (this.#reports[i] === report) {
                this.#reports.splice(i, 1);
                return
            }
        }
    }

    get reports() {
        return this.#reports;
    }

    //Getter: name
    get name() {
        return this.#name;
    }
    

    // Getter/Setter: mangager
    set manager(newManager) {
        this.#manager = newManager;
    }

    get manager() {
        return this.#manager;
    }


    // Getter: id
    get id() {
        return this.#id;
    }


    print(numSpaces = 0) {
        console.log(" ".repeat(numSpaces) + `${this.#name} [${this.#id}]`)
        for (let report of this.#reports) {
            report.print(numSpaces + 2);
        }
    }
}






class OrgStruct {
    #employees;
    
    constructor() {
        this.#employees = [];
    }
    
    // Checks if an employee is in #employees
    #isEmployee(targetEmployee) {
        for (let employee of this.#employees) {
            if (targetEmployee === employee) {
                return true;
            }
        }
        return false;
    }

    // Returns the employee associated with a specific ID
    #getEmployeeFromId(id, calledFrom = "Not Specified") {
        for (let employee of this.#employees) {
            if (id === employee.id) {
                return employee;
            }
        }
        throw new Error(`Error in OrgStruct.#getEmployeeFromId, called from ${calledFrom}: ID does not match any existing employees.`)
    }


    // Add an employee to system. Manager is optional.
    add(employeeId, name, managerId = null) {
        // Check that Employee Id is not already taken.
        for (let employee of this.#employees) {
            if (employee.id === employeeId) {
                throw new Error("Error from OrgStruct.add(): Employee Id is already taken.")
            }
        }

        // Check if employee should be added under an existing manager or not
        try {
            this.#getEmployeeFromId(managerId);
        }
        catch {  // Catches if the manager doesn't exist so then new employee has no manager
            this.#employees.push(new Employee(employeeId, name))
            return;
        }

        // Add employee with manager
        let manager = this.#getEmployeeFromId(managerId);
        this.#employees.push(new Employee(employeeId, name, manager))
        // Add employee to manager's reports
        manager.addReport(this.#getEmployeeFromId(employeeId));
    }
    

    // Move employee from one manager to another.
    move(employeeId, newManagerId) {
        let employee = this.#getEmployeeFromId(employeeId, "OrgStruct.move()");
        let newManager = this.#getEmployeeFromId(newManagerId, "OrgStruct.move()");
        // if employee had manager, remove them from old manager's reports, 
        if (employee.manager !== null) {
            employee.manager.removeReport(employee);
        }
        // Update employee's manager
        employee.manager = newManager;
        // Add employee to new managers reports
        newManager.addReport(employee)
    }
    
    // Remove employe from system. Add their reports to their manager's reports
    remove(employeeId) {
        let employee = this.#getEmployeeFromId(employeeId, "OrgStruct.remove()");
        // If employee has a manager
        if (employee.manager !== null) {
            employee.manager.removeReport(employee) // remove employee from their manager's reports.
            employee.manager.addReports(employee.reports); // add employee's reports to manager's reports.
            for (let report of employee.reports) { // update all reports' managers to new manager
                report.manager = employee.manager;
            }
        }
        // Else set all employee's reports' managers to null
        else {
            for (let report of employee.reports) {
                report.manager = null;
            }
        }
        
        // Remove employee from employees
        for (let i = 0; i < this.#employees.length; i++) {
            if (this.#employees[i] === employee) {
                this.#employees.splice(i, 1);
                return
            }
        }
    }
    
    // Recursive helper for countReports()
    #recursiveCountHelper(employee) {
        // Base case: employee has no reports so they only count themself
        if (employee.reports.length === 0) {
            return 1;
        }
        // Recursive case: employee has reports so recursively count them.
        else {
            let count = 1;
            for (let report of employee.reports) {
                if (this.#isEmployee(report)) { // Check that report is in system (not needed but is an extra check)
                    count += this.#recursiveCountHelper(report)
                }
            }
            return count;
        }
    }

    // Counts number of reports under an employee. Including secondary and on reports.
    countReports(employeeId) {
        let employee = this.#getEmployeeFromId(employeeId, "OrgStruct.count()");
        // -1 because the initial employee should not be counted, but after (in countHelper),
        // every employee should be counted.
        console.log(`${employee.name} [${employee.id}] has ${this.#recursiveCountHelper(employee) - 1} reports.`)
    }
    
    // Prints all employees (formatted).
    print() {
        // prints out all #employees (not formatted correctly)
        for (let employee of this.#employees) {
            if (employee.manager === null) {
                employee.print();
            }
        }
    }
    
}

// let orgStruct
let myOrgStruct = new OrgStruct();

// myOrgStruct.add(2, "Kevin");
// myOrgStruct.add(1, "Bob");
// myOrgStruct.print();
// console.log("\n----------------------------------------------\n")
// myOrgStruct.add(3, "Tim", 1);
// myOrgStruct.print();
// console.log("\n----------------------------------------------\n")
// myOrgStruct.move(3, 2);
// myOrgStruct.print();
// console.log("\n----------------------------------------------\n")
// myOrgStruct.move(2, 1);
// myOrgStruct.add(4, "Ralph", 2);
// myOrgStruct.print();
// myOrgStruct.countReports(1);
// console.log("\n----------------------------------------------\n")
// myOrgStruct.remove(2);
// myOrgStruct.print();
// myOrgStruct.countReports(1);
