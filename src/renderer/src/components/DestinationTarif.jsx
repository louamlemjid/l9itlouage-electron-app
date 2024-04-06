
function DestinationTarif(){
  
  return (
    <>
    
    <form  id="adminStation" >
        <label for="destination" className="fs-3">Entrer une destination</label>
        <div className="col-md-2 col-4 m-auto input-group">
          <span className="input-group-text bg-transparent text-dark">Destination</span>
        <input 
          type="text"
          id='city' 
          className="form-control bg-dark text-light"
           />
        </div>
        <label for="tarif" className="fs-3">Fixer le prix</label>
        <div className="col-md-2 col-4 m-auto input-group">
            <span className="input-group-text bg-transparent text-dark">Tarif</span>
            <input 
              type="number"
              id="tarif" 
              className="form-control bg-dark text-light"
               />
        </div>
        <button type="submit" className="btn btn-dark w-50 m-auto">Ajouter</button>
    </form>
    </>
  );
  }

export default DestinationTarif;
