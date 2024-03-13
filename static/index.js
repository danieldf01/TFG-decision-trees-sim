var data = {
  "name": "Eve",
  "children": [
    {
      "name": "Cain"
    },
    {
      "name": "Seth",
      "children": [
        {
          "name": "Enos"
        },
        {
          "name": "Noam"
        }
      ]
    },
    {
      "name": "Abel"
    },
    {
      "name": "Awan",
      "children": [
        {
          "name": "Enoch"
        }
      ]
    },
    {
      "name": "Azura"
    }
  ]
};



// const tree = {
//     title: 'A',
//     children: [
//         {
//             title: 'B',
//             children: [
//                 {
//                     title: 'D'
//                 }
//             ]
//         },
//         {
//             title : 'C'
//         }
//     ]
// }
//
// function start(node){
//     document.getElementById("my-div").style.textAlign = "Node: " + node.title
//     if(node.children){
//         node.children.forEach(function(child){
//             start(child);
//         })
//     }
// }
//
// start(tree);

// var data = [{"name":"container-1","type":"container","description":"container description"},{"name":"category-1","type":"category","parent":"container-1"},{"name":"grid-1","type":"grid","parent":"category-1"},{"name":"chart-1","type":"chart","parent":"category-1"},{"name":"container-2","type":"container"},{"name":"category-2","type":"category","parent":"container-2"},{"name":"category-3","type":"category","parent":"container-2"},{"name":"grid-2","type":"grid","parent":"category-2"},{"name":"chart-2","type":"chart","parent":"category-2"},{"name":"grid-3","type":"grid","parent":"category-3"}]
//
// function toTree(data, pid = undefined) {
//   return data.reduce((r, e) => {
//     if (pid == e.parent) {
//       const obj = { ...e }
//       const children = toTree(data, e.name)
//       if (children.length) obj.children = children;
//       r.push(obj)
//     }
//
//     return r
//   }, [])
// }
//
// function toHtml(data, isRoot = true) {
//   const ul = document.createElement('ul')
//
//   if (!isRoot) {
//     ul.classList.add('hide')
//   }
//
//   data.forEach(e => {
//     let isVisible = isRoot;
//     const li = document.createElement('li')
//     const text = document.createElement('span')
//     const button = document.createElement('button')
//
//     if (e.children) {
//       button.textContent = '+'
//       li.appendChild(button)
//     }
//
//     text.textContent = e.name
//     li.appendChild(text)
//
//     if (e.children) {
//       const children = toHtml(e.children, false)
//       li.appendChild(children)
//
//       button.addEventListener('click', function() {
//         if (isRoot) {
//           isVisible = !isVisible
//         }
//
//         button.textContent = isVisible ? '+' : '-'
//         children.classList.toggle('hide')
//
//         if (!isRoot) {
//           isVisible = !isVisible
//         }
//       })
//     }
//
//     ul.appendChild(li)
//
//   })
//
//   return ul;
// }
//
// const tree = toTree(data)
// const html = toHtml(tree)
//
// document.body.appendChild(html)

function changeColor() {
    document.getElementById("my-div").style.backgroundColor = "green";
}

function loadsvg() {
    // var svg = document.getElementsByTagName('svg')[0];
    // var element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    // element.setAttributeNS(null, 'x', 10);
    // element.setAttributeNS(null, 'y', 15);
    // element.setAttributeNS(null, 'width', 25);
    // element.setAttributeNS(null, 'height', 30);
    // element.setAttributeNS(null, 'fill', '#007bff');
    // svg.appendChild(element);
    // console.log(1 < 2);

    document.addEventListener('DOMContentLoaded', updateSVGs);
}

// console.log(document.getElementsByTagName('svg').length);
function updateSVGs() {
    var svg = document.getElementById('inline-svg');
    var element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    element.setAttributeNS(null, 'r', 20)
    element.setAttributeNS(null, 'x', 45);
    element.setAttributeNS(null, 'y', 15);
    element.setAttributeNS(null, 'width', 25);
    element.setAttributeNS(null, 'height', 30);
    element.setAttributeNS(null, 'fill', '#ec008c');
    svg.appendChild(element)
    // var svg = document.getElementById('inline-svg');
    // addRect(svg);
    // svg.removeChild(document.getElementById('background'));
    // var element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    // element.setAttributeNS(null, 'x', 5);
    // element.setAttributeNS(null, 'y', 15);
    // var txt = document.createTextNode("Hello World");
    // element.appendChild(txt);
    // svg.appendChild(element);
    //
    // var svgObject = document.getElementById('svg-object').contentDocument;
    // var svg = svgObject.getElementsByTagName('svg')[0];
    // var el = svgObject.getElementById("target");
    // console.log(el);
    // addRect(svg);
}

function buildTree(){
    var canvas = d3.select("body").append("svg")
        .attr("width", 500)
        .attr("height", 500);

    var diagonal = d3.svg.diagonal()
        .source({x: 10, y: 10})
        .target({x: 300, y: 300})

    canvas.append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("d", diagonal);

}

// const getTreeData = () => {
//     return {
//         element: 'test',
//         left: {
//             element: 'test12',
//             left: {
//                 element: 'test122',
//             },
//             right: {
//                 element: 'test123',
//             },
//         },
//         right: {
//             element: 'test13',
//             left: {
//                 element: 'test132',
//             },
//             right: {
//                 element: 'test133',
//                 left: {
//                     element: 'test1332',
//                 },
//                 right: {
//                     element: 'test1333',
//                 },
//             },
//         },
//     };
// }


