using {
    cuid,
    Currency
} from '@sap/cds/common';

namespace node_to_java;

entity Employees : cuid {
    email       : String;
    firstName   : String;
    lastName    : String;
    gender      : Gender not null;
    hireDate    : Date default '1900-01-01' not null;
    department  : Association to Departments;
    companyCode : String(4);
    dateOfBirth : Date default '1900-01-01' not null;
    salary      : Double default '0.00' not null;
    role        : Association to Roles;
    currency    : Currency default 'USD' not null
}

entity Departments : cuid {
    name : String;
}

entity Roles : cuid {
    name       : String;
    baseSalary : Double not null;
    currency   : Currency default 'USD'
}

type Gender : Boolean enum {
    MALE = false;
    FEMALE = true;
};
