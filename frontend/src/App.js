import React, { useState, useEffect} from 'react';
import './App.css';
const axios = require('axios').default;

function SelectFilter({select_filter}) {
  // args:
    // select_filter = a function that state the filter on displayed grid
  // returns
    // select UI component

  return (
    <div className="select_filter">
      <label>Tag filter: </label>
      <select onChange={select_filter}>
        <option value="all">All</option>
        <option value="favorite">Favorite</option>
        <option value="watching">Watching</option>
        <option value="forFriends">forFriends</option>
      </select> 
    </div>
  )
}

function Table({data, display_stock_info, filter, delete_stock}) {
  // args
    // data = json data of stocks
    // display_stock_info = a function that shows bottom div with stock info
    // filter = varible to determine grid filer of stocks
    // delete_stock = a function that makes api call to delete a stock


  // returns
    // html table with stocks filtered varible

  var tableData = []

  for ( var i in data) {
    if (filter) {
      if (filter === data[i]['tag']) {
        tableData.push(
          <TableData
           key={i}
            i={i} 
            display_stock_info={display_stock_info} 
            data={data}
            delete_stock={delete_stock} />
        )
      }
    } else { 
      tableData.push(
        <TableData
          key={i}
            i={i} 
            display_stock_info={display_stock_info} 
            data={data}
            delete_stock={delete_stock} />
      )
    }
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Last Price</th>
          <th>Tag</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tableData}
      </tbody>
   </table>
  )
}


function TableData({i, display_stock_info, data, delete_stock}) {

  //args
    //i = index 
    //display_stock_info = function to display bottom div with stock info
    //data = json data of stocks
    // delete_stock = function that makes api call to delete stock

  const [isShown, setIsShown] = useState(false);
 
  return (
    <>
      <tr> 
        <td>              
          <button 
              className="link" 
              onClick={() => display_stock_info(data[i])}>
            {data[i]['symbol'].toUpperCase()} 
          </button>
        </td>
        <td>{data[i]['last_price'].toFixed(2)}</td>
        <td>{data[i]['tag']}</td>
        <td 
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}>
          {isShown && ( 
            <button
                onClick={() => delete_stock(i)}
                className="link">
              X
            </button>
          )}
        </td>
      </tr>
    </>
  ) 

}


function StockInfo({info}) {
  // args
    // info = json object with with stock details
  
  // returns 
    // html botom div with symbol, name, market cap, and tag

  return (
    <div className="StockInfo">
      <h3>Stock Detail</h3>
      <table className="StockInfoTable">
        <tbody>
          <tr className="spaceUnder">
            <td>Symbol: {info['symbol'].toUpperCase()}</td>
            <td>Name: {info['name']}</td>
          </tr>
          <tr className="spaceUnder">
            <td>Market Cap: {info['market_cap']}</td>
            <td>Tag: {info['tag']}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}


function App() {
  const [data, setData] = useState(false)
  const [filter, setFilter] = useState(false)
  const [stockInfo, setStockInfo] = useState(false)

  useEffect(() => {
       getStockData()
  }, [data])

  function getStockData() {
    // get call made to get all stock data

    return axios
      .get("http://localhost:8080/stocks")
      .then((res) => {
        if (res.data.length === 0) setData(false)
        else setData(res.data)
      })
      .catch( err => {
        console.log(err)
      })
   } 
  
  function delete_stock(id) {
    // delete api call to delete a stock based on id

    //args
      // id - the id of a stock 
    return axios
      .delete("http://localhost:8080/stocks/" + id)
        .then((res) => {
          var hold = data
          delete hold[id]
          setData(hold)
      })
      .catch( err => {
        console.log("here is err: " + err)
      })
  }

  function select_filter(e) {
    // args
      // e = event from select button being pushed
    if (e.target.value === "all") setFilter(false)
    else setFilter(e.target.value)
  }

  function displayStockInfo(data) {
    // args
      // data = json obj with stock symbol, name, market_cap, and tag
    setStockInfo(data)
  }

  return (
    <div className="Stocks">
      <br /><br />
      <SelectFilter select_filter={select_filter}/><br /><br />
      <Table 
        data={data} 
        filter={filter} 
        display_stock_info={displayStockInfo} 
        delete_stock={delete_stock}/>
      <br /><br />
      {  stockInfo &&
        <StockInfo info={stockInfo}/> 
      }
    </div>
  );
}

export default App;
