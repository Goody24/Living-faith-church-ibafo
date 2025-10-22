let user = {
    firsname: 'Goodluck',
    lastname: 'Onyenso',
    Sex: 'Female',
    age: 32,
    'State of Origin': 'Anambra',
};

console.table(user);
delete user.age;
console.table(user);
console.log(user['State of Origin']);