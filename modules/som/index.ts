import { Note, Instrument } from '@org.bukkit';
import * as async from 'async';

// this only exists because method overloading in JS-to-Java fuckin sucks.
function getNoteId(octave: number, note: Note.Tone) {
	return note.ordinal() * octave;
}

function getNoteFromString(note: string, octave: number) {
	if (note.length > 2) throw new Error('Invalid note ' + note);
	var isSharp = false;

	if (/#$/i.test(note)) {
		isSharp = true;
	}
	return new Note(octave, Note.Tone.valueOf(note[0]), isSharp);
}

function getWaitTimeForBeat(bpm: number) {
	var bps = bpm/60;
	// if bpm = 120, bps = 2
	return (1/bps) * 1000; // 500ms
}

function getNoteLength(bpm: number, beats: number) {
	var wt = getWaitTimeForBeat(bpm);
	return beats * wt;
}

export class Song {
	instrument: Instrument;
	bpm: number = 120;
	measure: Measures = Measures.THREE_QUARTERS;
	__build: SongNote[] = [];
	__buildi: number = 0;
	__playi: number = 0;

	play(note: string, octave: number, beats: number = 1) {
		var n = getNoteFromString(note, octave);
		for (var i = 0; i < beats; i++, this.__buildi++) {
			this.__build.push(new SongNote(n));
		}
	}

	wait(beats: number = 1) {
		for (var i = 0; i < beats; i++, this.__buildi++) {
			this.__build.push(SongNote.empty());
		}
	}

	playFor(player) {
		async(() => {
			setInterval(() => {
				// on each interval, we determine what to play next
				let note = this.__build[this.__playi];
				if (note.note !== SongNote.empty()) {
					player.playNote(player.getLocation(), this.instrument, note.note);
				}
			}, getWaitTimeForBeat(this.bpm));
		});
	}
}

class SongNote {
	note: Note;

	constructor(note: Note) {
		this.note = note;
	}

	static empty() {
		return new SongNote(null);
	}
}

export enum Measures {
	TWO_QUARTERS,
	THREE_QUARTERS,
	FOUR_QUARTERS,
	SIX_EIGHTHS
}