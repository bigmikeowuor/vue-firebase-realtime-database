const firebaseConfig = {
	apiKey: 'AIzaSyA1ZC3mQKwmTt7RuJMDz1PUE-4pesGYoNo',
	authDomain: 'mando-chat-wap.firebaseapp.com',
	databaseURL: 'https://mando-chat-wap-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'mando-chat-wap',
	storageBucket: 'mando-chat-wap.appspot.com',
	messagingSenderId: '738197980194',
	appId: '1:738197980194:web:d7490f00bb8e14a011b67b',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Open connection to the Firebase database
const database = firebase.database();

const messagesRef = database.ref('messages');

const app = new Vue({
	el: '#chat',

	data: {
		messages: [],
		messageText: '',
		nickname: 'gambit',
		editingMessage: null,
	},

	methods: {
		storeMessage() {
			messagesRef.push({ text: this.messageText, nickname: this.nickname });
			this.messageText = '';
		},

		deleteMessage(message) {
			messagesRef.child(message.id).remove();
		},

		editMessage(message) {
			this.editingMessage = message;
			this.messageText = message.text;
		},

		cancelEditing() {
			this.editingMessage = null;
			this.messageText = '';
		},

		updateMessage() {
			messagesRef.child(this.editingMessage.id).update({ text: this.messageText });
			this.cancelEditing();
		},
	},

	created() {
		messagesRef.on('child_added', (snapshot) => {
			this.messages.push({ ...snapshot.val(), id: snapshot.key });

			if (snapshot.val().nickname !== this.nickname) {
				nativeToast({
					message: `New message by ${snapshot.val().nickname}`,
					position: 'south-east',
					timeout: 5000,
					type: 'success',
				});
			}
		});

		messagesRef.on('child_removed', (snapshot) => {
			const deleteMessage = this.messages.find((message) => message.id === snapshot.key);
			const index = this.messages.indexOf(deleteMessage);

			this.messages.splice(index, 1);

			if (snapshot.val().nickname !== this.nickname) {
				nativeToast({
					message: `Message deleted by ${snapshot.val().nickname}`,
					position: 'south-east',
					timeout: 5000,
					type: 'warning',
				});
			}
		});

		messagesRef.on('child_changed', (snapshot) => {
			const updatedMessage = this.messages.find((message) => message.id === snapshot.key);

			updatedMessage.text = snapshot.val().text;

			if (snapshot.val().nickname !== this.nickname) {
				nativeToast({
					message: `Message edited by ${snapshot.val().nickname}`,
					position: 'south-east',
					timeout: 5000,
					type: 'info',
				});
			}
		});
	},
});
