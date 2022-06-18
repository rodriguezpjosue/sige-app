import { memo } from 'react';

function HomeContent() {
  return (
    <div>
      <img
        src="assets/images/demo-content/culturaEmmanuel.jpg"
        alt="emmanuel"
        style={{
          // maxWidth: '640px',
          width: '100%',
        }}
        className="rounded-6"
      />
      <h1 className="py-16 font-semibold">Somos Emmanuel</h1>
      <h4 className="pb-12 font-medium">Nuestra visión</h4>
      <p>
        Ser transformados por el amor de Dios, amar a todas las personas y trascender a las nuevas
        generaciones.
      </p>
      <h4 className="pb-12 font-medium">Nuestros valores</h4>
      <p>
        Intimidad con Dios <br />
        Comunidad <br />
        Amor desinteresado <br />
        Trascendencia <br />
        Servicio <br />
        Profundidad <br />
        Honra <br />
      </p>
    </div>
  );
}

export default memo(HomeContent);
