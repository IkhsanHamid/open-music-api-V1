/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class SongHandler {
  constructor(service, validator) {
    this._songService = service;
    this._songValidator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._songValidator.validateSongPayload(request.payload);
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;
    const songId = await this._songService.addSongs({
      title, year, genre, performer, duration, albumId,
    });
    const response = h.response({
      status: 'success',
      message: 'Songs berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getAllSongsHandler(request) {
    const { title, performer } = request.params
    const songs = await this._songService.getAllSongs(title, performer );
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._songService.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async editSongByIdHandler(request) {
    this._songValidator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._songService.editSongsById(id, request.payload);

    return {
      status: 'success',
      message: 'Songs berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._songService.deleteSongById(id);

    return {
      status: 'success',
      message: 'Songs berhasil dihapus',
    };
  }
}
module.exports = SongHandler;
