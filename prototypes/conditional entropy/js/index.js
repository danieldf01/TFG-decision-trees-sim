function calcRatio(){
    var table = document.getElementById('table-cond-entropy-1');
    var items = table.getElementsByTagName('input');

    var sum = 0;
    rowSums = [];
    for (var i = 0; i < items.length; i++) {
        sum += parseInt(items[i].value);
        if(i % 2){
            rowSums.push(parseInt(items[i-1].value) + parseInt(items[i].value));
        }
    }

    var tBodyRef = table.getElementsByTagName('tbody')[0];
    rowCount = tBodyRef.rows.length;
    for (var i = 0; i < rowCount; i++) {
        ratioCell = tBodyRef.getElementsByTagName('tr')[i].getElementsByTagName('td')[3];
        ratioLabel = ratioCell.getElementsByTagName('label')[0];
        ratioLabel.innerHTML = rowSums[i] / sum;
    }
}

function calcCondEntropy(){
    calcRatio();

}