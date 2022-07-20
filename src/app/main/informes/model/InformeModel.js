import _ from '@lodash';

const InformeModel = (data) =>
  _.defaults(data || {}, {
    state: 'draft',
    tema: '',
    tiporeunion_id: null,
    fechareunion: new Date(),
    asistentes_ids: [],
    observaciones: '',
  });

export default InformeModel;
