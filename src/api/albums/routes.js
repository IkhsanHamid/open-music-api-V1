const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbumsHandler(request, h),
  },
  {
    method: 'GET',
    path: '/GetAllAlbums',
    handler: () => handler.getAlbumsHandler(),
  },
  {
    method: 'GET',
    path: '/GetAllAlbumsById/{id}',
    handler: (request) => handler.getAlbumsByIdHandler(request),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request) => handler.editAlbumsByIdHandler(request),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request) => handler.deleteAlbumsByIdHandler(request),
  },
];

module.exports = routes;
