import React, { Component } from "react";
import "./speech-synth.css";

class SpeechSynth extends Component {
	constructor(props) {
		super(props);
		this.state = {
			voices: [],
			msg: {},
		};
	}
	componentDidMount() {
		const msg = new SpeechSynthesisUtterance();
		const voicesDropdown = document.querySelector('[name="voice"]');

		const options = document.querySelectorAll(
			'[type="range"], [name="text"]'
		);
		const text = document.querySelector("[name='text']");
		const speakButton = document.querySelector("#speak");
		const stopButton = document.querySelector("#stop");

		window.speechSynthesis.addEventListener(
			"voiceschanged",
			this.getVoices
		);
		speakButton.addEventListener("click", this.playText);
		stopButton.addEventListener("click", this.stopText);
		voicesDropdown.addEventListener("change", this.updateVoice);
		options.forEach((option) => {
			option.addEventListener("change", this.setOptions);
		});

		msg.text = text.value;
		this.setState({ msg });
	}

	setOptions = (e) => {
		let msg = this.state.msg;
		const text = document.querySelector("[name='text']");

		msg.text = text.value;

		msg[e.target.name] = e.target.value;
		this.setState({ msg });

		this.toggle();
	};

	getVoices = async () => {
		let voices = [];
		voices = await window.speechSynthesis.getVoices();

		console.log(voices);
		if (voices) this.setState({ voices });
		this.populateList();
	};

	updateVoice = (e) => {
		let msg = this.state.msg;
		msg.voice = this.state.voices.find(
			(voice) => voice.name === e.target.value
		);
		this.setState({ msg });
		console.log({ msg });
		this.toggle();
	};

	toggle = () => {
		let msg = this.state.msg;
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(msg);
	};

	populateList = function () {
		const voicesDropdown = document.querySelector('[name="voice"]');

		voicesDropdown.innerHTML = this.state.voices
			.map((voice) => {
				return `<option value="${voice.name}">${voice.name}</option>`;
			})
			.join("");
	};

	playText = function () {
		let msg = new SpeechSynthesisUtterance();
		const text = document.querySelector("[name='text']");
		msg.text = text.value;

		window.speechSynthesis.speak(msg);
	};

	stopText = function () {
		let msg = new SpeechSynthesisUtterance();
		const text = document.querySelector("[name='text']");
		msg.text = text.value;

		window.speechSynthesis.cancel(msg);
	};

	render() {
		return (
			<div class="voiceinator">
				<h1>Text to Speech</h1>

				<select name="voice" id="voices">
					<option value="">Select A Voice</option>
					{this.state.voices.map((voice) => {
						return `<option value="${voice.name}">${voice.name}</option>`;
					})}
				</select>

				<label for="rate">Rate:</label>
				<input
					name="rate"
					type="range"
					min="0"
					max="5"
					// value="1"
					step="0.1"
				/>

				<label for="pitch">Pitch:</label>

				<input name="pitch" type="range" min="0" max="2" step="0.1" />
				<textarea name="text">Hello! I love JavaScript 👍</textarea>
				<button id="stop">Stop!</button>
				<button id="speak">Speak</button>
			</div>
		);
	}
}

export default SpeechSynth;
