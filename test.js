
function test() {
  const getRandomIndex = num => {
    return Math.floor(Math.random() * Math.floor(num))
  }

  const featuredHomes = []

  while (featuredHomes.length < 4) {
    const homeNum = getRandomIndex(4)
    console.log('homeNum: ', homeNum)
    const invalid = featuredHomes.includes(homeNum)
    console.log('invalid: ', invalid)
    if (!invalid) {
      featuredHomes.push(homeNum)
    }
  }
  console.log(featuredHomes)
}

test()
