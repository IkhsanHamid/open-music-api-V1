/* eslint-disable comma-dangle */
/* eslint-disable camelcase */
const mapDBtoAlbums = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});
const mapDBtoSongs = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});
const mapDBDetailSongToModel = ({ album_id, ...args }) => ({
  ...args,
  albumId: album_id,
});

module.exports = { mapDBtoAlbums, mapDBtoSongs, mapDBDetailSongToModel };
