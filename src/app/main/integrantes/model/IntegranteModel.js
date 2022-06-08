import _ from '@lodash';

const ContactModel = (data) =>
  _.defaults(data || {}, {
    image_small: '',
    mobile: null,
    name: '',
    apellido_paterno: '',
    apellido_materno: '',
    nombre1: '',
    nombre2: '',
    email: '',
    fecha_nacimiento: null,
    street: '',
  });

export default ContactModel;
