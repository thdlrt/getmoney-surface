import axios from "~/axios";
export function getalogrithm() {
  //return axios.post("/api/ai/index");
  return [{
        value: 'asd',
        label: 'asd',
      },
      {
        value: 'qwe',
        label: 'qwe',
      },
      {
        value: 'Option3',
        label: 'Option3',
      },
      {
        value: 'Option4',
        label: 'Option4',
      },
      {
        value: 'Option5',
        label: 'Option5',
      },];
}
export function getfuture(data) {
    // return axios.post("/api/ai/getfuture",{
    //     date:data.date,
    //     alogrithm:data.alogrithm,
    // });
    return [[[
        "name",
        "date",
        "price",
    ]], [[
        "qwe",
        "2021-05-01",
        33.3,
    ], [
        "qwe",
        "2021-05-02",
        34.3,
    ], [
        "qwe",
        "2021-05-03",
        35.3,
    ], [
        "qwe",
        "2021-05-04",
        36.3,
    ], [
        "qwe",
        "2021-05-05",
        37.3,
    ], [
        "qwe",
        "2021-05-06",
        38.3,
    ], [
        "qwe",
        "2021-05-07",
        39.3,
    ]], [[
        "asd",
        "2021-05-01",
        34.8,
    ], [
        "asd",
        "2021-05-02",
        36.7,
    ], [
        "asd",
        "2021-05-03",
        38.6,
    ], [
        "asd",
        "2021-05-04",
        40.5,
    ], [
        "asd",
        "2021-05-05",
        23.9,
    ], [
        "asd",
        "2021-05-06",
        24.8,
    ], [
        "asd",
        "2021-05-07",
        25.7,
    ]]]
  }