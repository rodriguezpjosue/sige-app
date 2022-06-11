import _ from '@lodash';

const AperturaModel = (data) =>
  _.defaults(data || {}, {
    state: 'draft',
    tema: 'TcD',
    tiporeunion_id: 1,
    fechareunion: new Date(),
    asistentes_ids: [],
    observaciones: '',
  });

export default AperturaModel;
