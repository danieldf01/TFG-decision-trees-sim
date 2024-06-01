const dataInfo = {
    "Play Golf 1": "This dataset includes weather-related features that affect the decision of whether to play golf or not, such as outlook (sunny, overcast, rainy), temperature, humidity, and wind conditions. It's a great starting point for beginners in machine learning due to its simplicity.",
    "Iris": "This dataset contains a set of 150 records under 5 attributes - Sepal Length, Sepal width, Petal Length, Petal Width and its label. The dataset has been discretized to only work with two class labels and discrete values, instead of numerical ones."
}

const dataLinks = {
    "Play Golf 1": "https://www.kaggle.com/datasets/saadabdurrazzaq/play-golf-dataset",
    "Iris": "https://www.kaggle.com/datasets/arshid/iris-flower-dataset"
}

function getDataInfo(datasetName) {
    return dataInfo[datasetName];
}

function getDataLink(datasetName) {
    return dataLinks[datasetName];
}

export {getDataInfo, getDataLink};
export default getDataInfo;