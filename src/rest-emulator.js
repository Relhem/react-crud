export default class RestEmulator{
    static storage = [
        {
						id: 0,
            name: 'John',
            age: '18',
            job: 'programmer',
        },
        {
						id: 1,
            name: 'Mike',
            age: '25',
            job: 'doctor',
        },
    ]

		static getEntries() {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(JSON.parse(JSON.stringify(RestEmulator.storage)));
				}, 500);
			})
		}

		static findId() {
			let id = 0;
			RestEmulator.storage.forEach((entry) => {
				if (Number(entry.id) > id) id = entry.id;
			});
			return Number(id) + 1;
		}

		static addPerson(name, age, job) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					try {
						const newUser = { id: RestEmulator.findId(), name, age, job };
						RestEmulator.storage.push(newUser);
						resolve('success');
					} catch (error) {
						reject(error);
					}
				}, 500);
			});
		}

		static removePerson(id) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					try {
						this.storage = this.storage.filter((person) => person.id != id);
						resolve('success');
					} catch (error) {
						reject(error);
					}
				}, 500);
			});
		}

		static editPerson(id, object) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					const person = this.storage.filter((person) => person.id == id)[0];
					if (!person) reject('not found');
					else {
						person.name = object.name;
						person.age = object.age;
						person.job = object.job;
						resolve('success');
					}
				}, 500);
			});
		}
}