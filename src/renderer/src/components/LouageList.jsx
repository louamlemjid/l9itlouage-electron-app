export default LouageList=()=>{
    return (
        <table className="table table-hover w-75 m-auto">
        <thead>
          <tr className="table-dark">
            <th className="text-center" scope="col">email</th>
            <th className="text-center" scope="col">password</th>
            <th className="text-center" scope="col">date d'expiration</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {cityData.map((item) => (
            <tr key={item._doc.email} className="table-success opacity-75">
              <td className="text-center">{item._doc.email}</td>
              <td className="text-center">{item._doc.password}</td>
              <td className="text-center">{fullDate(item._doc.expireDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
}

const fullDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };