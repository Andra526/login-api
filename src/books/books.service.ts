import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity.js';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private readonly booksRepository: Repository<Book>,
    ) {}

    // Mencari semua data buku
    async findAll(): Promise<Book[]> {
        return await this.booksRepository.find({
            order: { id: 'DESC' }, // Ubah ke id jika entity tidak memiliki kolom createdAt
        });
    }

    // Menyimpan data buku baru ke database
    async create(book: Partial<Book>): Promise<Book> {
        const newBook = this.booksRepository.create(book);
        return await this.booksRepository.save(newBook);
    }

    // Mencari buku berdasarkan ID
    async findById(id: string): Promise<Book> {
        const book = await this.booksRepository.findOneBy({ id });
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }

    // Mengupdate data buku berdasarkan ID
    async update(id: string, updatedBookDTO: Partial<Book>): Promise<Book> {
        const book = await this.findById(id);

        const updatedBook = this.booksRepository.merge(book, updatedBookDTO);
        return await this.booksRepository.save(updatedBook);
    }

    // Menghapus data buku berdasarkan ID
    async delete(id: string): Promise<{ message: string; deleteId: string }> {
        const book = await this.findById(id);
        await this.booksRepository.softDelete(id); // Perbaikan dari softdelete ke softDelete

        return {
            message: `Book with ID ${id} has been deleted successfully.`,
            deleteId: id,
        };
    }
}