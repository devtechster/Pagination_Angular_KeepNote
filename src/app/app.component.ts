import { Component, OnInit } from "@angular/core";
import { NotesService } from "./notes.service";
import { Note } from "./note";
import { del } from "selenium-webdriver/http";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

  id: number;
  title: string;
  text: string;

  errMessage = "";
  note: Note = new Note();
  notes: Array<Note> = [];

  deleteArray: Array<Note> = [];
  delNote: Note;

  deleteid: number;
  flag : Boolean = false;

  constructor(private noteService: NotesService) {}

  ngOnInit() {
    this.noteService.getNotes().subscribe(
      data => {
        console.log(data);
        this.notes = data;
      },
      error => {
        this.errMessage = error.message;
      }
    );
  }
  takeNote() 
  {
    if ((this.note.title || this.note.text) !== "") {
      console.log(this.note);
      this.noteService.addNote(this.note).subscribe(
        data => {
          this.notes.push(data);
        },
        error => {
          this.errMessage = error.message;
        }
      );
      this.note = new Note();
    } else {
      this.flag =true;
      this.errMessage = "Title and Text both are required fields";
    }
  }

  takeNoteTwo() 
  {
    this.delNote = this.deleteArray.pop();

    if((this.delNote.title || this.delNote.text) != null)
    {
      this.noteService.addNote(this.delNote).subscribe(
        data => {
          this.notes.push(data);
        },
        error => {
          this.errMessage = error.message;
        }
      );
      this.note = new Note();
    }
    else
    {
      this.errMessage = "Nothing was deleted !!!";
    }
  }

  deleteAtIndex(id:number) 
  {
    this.deleteid = this.notes.findIndex(st => st.id === id);
    console.log(this.notes[this.deleteid]);

    if (this.notes[this.deleteid] != null) 
    {
      this.delNote=this.notes[this.deleteid];
      this.deleteArray.push(this.delNote);
    }

    this.noteService.deleteNote(id).subscribe(
      data => 
      {
        this.noteService.getNotes().subscribe(
          data => {
            console.log(data);
            this.notes = data;
          },
          error => {
            this.errMessage = error.message;
          }
        );
      },
      error => {
        this.errMessage = error.message;
      }
    );
  }


  errorDisplays()
  {
    this.flag = false;
    if(this.flag)
    {
      this.errMessage = "";
      this.flag = true;
    }
  }


  editStudent(mynote: Note) 
  {
    this.note = mynote;
  }

  onUpdate(id: number) {
    this.noteService.updateNote(id, this.note).subscribe(
      data => this.note = new Note(),
      error => this.errMessage = error
    );
  }

}
