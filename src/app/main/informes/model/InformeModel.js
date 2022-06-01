import _ from '@lodash';

const InformeModel = (data) =>
  _.defaults(data || {}, {
    state: 'borrador',
    tema: 'TcD',
    tiporeunion_id: 1,
    fechareunion: new Date(),
    asistentes_ids: [],
    observaciones: [],
  });

export default InformeModel;
