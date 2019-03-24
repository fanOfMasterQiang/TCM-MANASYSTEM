const usersData = []
for (let i = 0; i < 100; i += 1) {
  usersData.push({
    Id:`uid-${1000+i}`,
    Name:`user${i}`,
    Gender:Math.round(Math.random()),
    Age:Math.round(Math.random()*100)
  });
}

function getData(req, res,){
  const result = {
    Success:false,
    Data:null,
    Message:""
  };
  let ageCount = [];
  for(let i=0;i<10;i++){
    ageCount.push({
      x:`${10*i}-${10*(i+1)}`,
      y:0
    })
  }
  ageCount.push({
    x:'100以上',
    y:0
  })
  let genderData =[
    {x:'男',y:0},
    {x:'女',y:0}
  ]
  usersData.map(item => {
    switch (true) {
      case (item.Age>0 && item.Age<10):
        ageCount[0].y++;
        break;
      case (item.Age>10 && item.Age<20):
        ageCount[1].y++;
        break;
      case (item.Age>20 && item.Age<30):
        ageCount[2].y++;
        break;
      case (item.Age>30 && item.Age<40):
        ageCount[3].y++;
        break;
      case (item.Age>40 && item.Age<50):
        ageCount[4].y++;
        break;
      case (item.Age>50 && item.Age<60):
        ageCount[5].y++;
        break;
      case (item.Age>60 && item.Age<70):
        ageCount[6].y++;
        break;
      case (item.Age>70 && item.Age<80):
        ageCount[7].y++;
        break;
      case (item.Age>80 && item.Age<90):
        ageCount[8].y++;
        break;
      case (item.Age>90 && item.Age<100):
        ageCount[9].y++;
        break;
      default:
        ageCount[10].y++;
    }
    switch (true) {
      case item.Gender === 0:
        genderData[0].y++;
        break;
      default:
        genderData[1].y++;
    }
  })

  result.Success =true;
  result.Data ={ageCount,genderData};
  return res.json(result)
}

export default {
  'GET /api/user/getData': getData,
};
