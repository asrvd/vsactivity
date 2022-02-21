/* eslint-disable no-unused-vars */
/* database structure
    {
        "users": {
            "username": {
                "active": boolean,
                "file": string,
                "directory": string,
                "type": string
            }
        }
    }
*/

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, update } = require('firebase/database');
const firebaseConfig = require('./fireb.js');


const firebase = initializeApp(firebaseConfig);
const db = getDatabase(firebase);

function setData(user, file, dir, status, type) {
    set(
        ref(db, `users/` + user), {
            active: status,
            file: file,
            directory: dir,
            type: type
        }
    ).then(
        () => {
            console.log('set data success');
        }
    )
}

function updateActivity(user, status) {
    update(
        ref(db, `users/${user}`), {
            active: status
        }
    )
}

module.exports = {
    setData,
    updateActivity
}