import { model, Schema } from "mongoose";
import { IBook } from "./book.interface";

const bookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  genre: {
    type: String,
    enum: {
      values: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
      message: 'Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY.'
    },
    required: [true, 'Genre is required']
  },
  isbn:{
    type: String,
    unique:true,
    required:[true,'ISBN is required'],
    trim:true
  },
  description:{
    type: String,
    trim:true
  },
  copies:{
    type: Number,
    required:[true,'copies is required'],
    min:[0,'Copies must be a positive number']
  },
  available:{
    type:Boolean,
    default:true,
  }
},{
    versionKey:false,
    timestamps:true,
});

bookSchema.pre('findOneAndUpdate', async function (next) {
  const update: any = this.getUpdate();

  if (update.copies === 0) {
    update.available = false; 
    this.setUpdate(update);
  }
  else{
    update.available = true; 
    this.setUpdate(update);
  }

  next();
});

export const Book=model('Book',bookSchema)