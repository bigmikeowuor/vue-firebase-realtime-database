const firebaseConfig = {
	apiKey: 'AIzaSyA2ZnvfQiQ_UQIibcOEKIOZBdcdtxg0SYo',
	authDomain: 'mando-chat-room-mo.firebaseapp.com',
	databaseURL:
		'https://mando-chat-room-mo-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'mando-chat-room-mo',
	storageBucket: 'mando-chat-room-mo.appspot.com',
	messagingSenderId: '924359020779',
	appId: '1:924359020779:web:c939db93426d081c562eae',
	measurementId: 'G-NQ848Z5T15',
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
	},

	methods: {
		storeMessage() {
			messagesRef.push({ text: this.messageText, nickname: this.nickname });
			this.messageText = '';
		},

		deleteMessage(message) {
			messagesRef.child(message.id).remove();
		},
	},

	created() {
		messagesRef.on('child_added', (snapshot) =>
			this.messages.push({ ...snapshot.val(), id: snapshot.key })
		);
		messagesRef.on('child_removed', (snapshot) => {
			const deleteMessage = this.messages.find((message) => message.id === snapshot.key);
			const index = this.messages.indexOf(deleteMessage);

			this.messages.splice(index, 1);
		});
	},
});
