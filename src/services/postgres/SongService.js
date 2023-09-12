/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBtoSongs, mapDBDetailSongToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongs({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };
    const createSong = await this._pool.query(query);
    if (!createSong.rows[0].id) throw new InvariantError('Gagal menambahkan data Songs');
    return createSong.rows[0].id;
  }

  async getAllSongs(title, performer) {
    let filteredSongs = await this._pool.query('SELECT id, title, performer FROM songs');

    if (title !== undefined) {
      const query = {
        text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1',
        values: [`%${title}%`],
      };
      filteredSongs = await this._pool.query(query);
    }

    if (performer !== undefined) {
      filteredSongs = await this._pool.query(`SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE '%${performer}%'`);
    }

    return filteredSongs.rows.map(mapDBtoSongs);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const getById = await this._pool.query(query);
    if (!getById.rowCount) throw new NotFoundError(`Song dengan id = ${id} tidak ditemukan`);
    return getById.rows.map(mapDBDetailSongToModel)[0];
  }

  async editSongsById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError(`Gagal memperbaharui data songs, id = ${id} tidak ditemukan`);
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError(`Gagal menghapus data data, id = ${id} tidak ditemukan`);
  }
}

module.exports = SongService;
