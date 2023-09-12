/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(service, validator) {
    this._albumsService = service;
    this._albumsValidator = validator;
    autoBind(this);
  }

  async postAlbumsHandler(request, h) {
    this._albumsValidator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._albumsService.addAlbums({ name, year });
    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const Albums = await this._albumsService.getAllAlbums();
    return {
      status: 'success',
      data: {
        Albums,
      },
    };
  }

  async getAlbumsByIdHandler(request) {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async editAlbumsByIdHandler(request) {
    this._albumsValidator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._albumsService.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumsByIdHandler(request) {
    const { id } = request.params;
    await this._albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumHandler;
