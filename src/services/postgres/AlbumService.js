/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBtoAlbums, mapDBtoSongs } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  // ======= ALBUMS AREA =============
  async addAlbums({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1,$2,$3,$4,$5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };
    const createAlbum = await this._pool.query(query);
    if (!createAlbum.rows[0].id) throw new InvariantError('Album gagal ditambahkan');
    return createAlbum.rows[0].id;
  }

  async getAllAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBtoAlbums);
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };
    const getById = await this._pool.query(query);
    if (!getById.rowCount) throw new NotFoundError(`Album dengan id = ${id} tidak ditemukan`);
    const $query = {
      text : 'SELECT * FROM songs WHERE album_id = $1',
      values : [id]
    }
    const songs = await this._pool.query($query)
    return {
      ...getById.rows.map(mapDBtoAlbums)[0],
      songs : songs.rows.map(mapDBtoSongs)
    }
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError(`Gagal memperbaharui data album, id = ${id} tidak ditemukan`);
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError(`Gagal menghapus data album, id = ${id} tidak ditemukan`);
  }
}

module.exports = AlbumService;
