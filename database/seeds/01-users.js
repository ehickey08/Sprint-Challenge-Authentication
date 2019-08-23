const bcyrpt = require('bcryptjs')
exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('users')
        .truncate()
        .then(function() {
            // Inserts seed entries
            return knex('users').insert([
                { username: 'Bill', password: bcyrpt.hashSync('1234', 12) },
                { username: 'Jill', password: bcyrpt.hashSync('1234', 12)  },
                { username: 'Jane', password: bcyrpt.hashSync('1234', 12)  },
            ]);
        });
};
