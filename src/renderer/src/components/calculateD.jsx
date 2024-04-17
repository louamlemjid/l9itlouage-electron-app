const calculateD = (louagesInDestination, allLouages) => {
    let sum = 0;
    for (const e of allLouages) {
      if (louagesInDestination.includes(e._id)) {
        sum += e.availableSeats;
      }
    }
    return sum;
  };
  
  export default calculateD;
  