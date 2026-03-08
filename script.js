const LogInSec=document.getElementById("login");
const ID=document.getElementById("user");
const Password=document.getElementById("pass");
const IssueContainer=document.getElementById("issue-card-container");
const LoadingSpinner=document.getElementById("loadingSpinner");
const Navbar=document.getElementById("navbar");
const IssuesType=document.getElementById("issues-type");
const IssuesCounter=document.getElementById("issues-counter");
const MainPart=document.getElementById("main-part");
const TotalIssueCounter=document.getElementById("totalIssue");
const AllBtn=document.getElementById("btn-all");
const OpenBtn=document.getElementById("btn-open");
const ClosedBtn=document.getElementById("btn-closed");
const SearchInput=document.getElementById("search-box");
let allIssues=[];
const LogIn=()=>{
    if(ID.value==="admin" && Password.value==="admin123"){
         LogInSec.classList.add("hidden");
         MainPart.classList.remove("hidden");
         LoadIssues();
    }
    else{
        alert("Invalid Credentials");
    }
}
const showLoading=()=>{
    LoadingSpinner.classList.remove("hidden")
    LoadingSpinner.classList.add("flex");
    MainPart.classList.add("hidden");
}
const hideLoading=()=>{
     LoadingSpinner.classList.add("hidden");
     LoadingSpinner.classList.remove("flex");
     MainPart.classList.remove("hidden");
}
const showLabels=(array)=>{
    const LabelNames=array.map((el)=>{
    let badgeType="badge-error"
    if(el==="help wanted"){
    badgeType="badge-warning"
    }
    else if(el==="enhancement"){
    badgeType="badge-success"
    }
    else if(el==="first good issue"){
    badgeType="badge-info"
    }
    else if(el==="documentation"){
    badgeType="badge-primary"
    }
    return `<span class="badge badge-soft ${badgeType} text-[10px] font-bold uppercase p-3">${el}</span>`
});
   return LabelNames.join(" ");
}
async function LoadIssues() {
    showLoading();
    const res=await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    const data=await res.json();
    allIssues=data.data;
    hideLoading();
     DisplayIssues(allIssues);
}
const DisplayIssues=(issues)=>{
     IssueContainer.innerHTML= "";
    issues.forEach(element => {
            let bordercolor="border-green-400";
            if(element.status==='closed'){
                bordercolor="border-purple-500";
            }
            let statusImg="assets/Open-Status.png";
            if(element.status==='closed'){
                statusImg="assets/Closed- Status .png"
            }
            let topBatchText="text-[#EF4444]";
             let topBatchBg="bg-[#FEECEC]"
            if(element.priority==="medium"){
             topBatchText="text-[#F59E0B]";
             topBatchBg="bg-[#FFF6D1]"
            }
           else if(element.priority==="low"){
             topBatchText="text-[#9CA3AF]";
              topBatchBg="bg-[#EEEFF2]"
            }
    
        const issueCard=document.createElement("div");
        issueCard.onclick=()=>{
            LoadModal(element.id);
        };
       issueCard.innerHTML=`
        <div class="shadow-md rounded-md border-t-4 ${bordercolor} p-[10px]">
    <div class="flex justify-between">
      <img src="${statusImg}" alt="">
      <div class="badge badge-soft badge-warning ${topBatchText} ${topBatchBg}">${element.priority}</div>
    </div>
    <h4 class="font-semibold">${element.title}</h4>
    <p class="line-clamp-2">${element.description}</p>
    <div class="my-[10px]">
    <div>${showLabels(element.labels)}</div>
    </div>
    <hr>
    <p class="text-gray-500"># ${element.id} by ${element.author.replace("_"," ").toUpperCase()}</p>
    <p class="text-gray-500">${element.createdAt.split('T')[0]}</p>
  </div>
        `
        IssueContainer.appendChild(issueCard);
    });

    TotalIssueCounter.innerText=issues.length;
}
const allButtons=document.querySelectorAll(".filter-btn");
const toggleButton=(btnType)=>{
    allButtons.forEach(btn=>{
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline");
    })
    const activeBtn=document.getElementById(`btn-${btnType}`);
    activeBtn.classList.remove("btn-outline");
    activeBtn.classList.add("btn-primary");
    if(btnType=='all'){
        DisplayIssues(allIssues);
    }
    else{
        const filtered=allIssues.filter(issue=>issue.status===btnType);
        DisplayIssues(filtered);
    }
}
const LoadModal=(id)=>{
    url=`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
    fetch(url)
    .then(res=>res.json())
    .then(data=>{
        DisplayModal(data.data);
    })
}
const DisplayModal=(modal)=>{
    const modalBox=document.getElementById("modal_container");
     let badgeColor="bg-green-400"
    if(modal.status==='closed'){
    badgeColor="bg-purple-500"
}
    modalBox.innerHTML=`
    <h3 class="text-lg font-bold">${modal.title}</h3>
    <div class="flex gap-2">
      <div class="badge badge-md ${badgeColor} text-white">${modal.status}</div>
      <p class="text-gray-500">
        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
         • Opened by ${modal.author.replace("_"," ").toUpperCase()}</p>
      <p class="text-gray-500">
         <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
         • ${modal.updatedAt.split('T')[0]}</p>
    </div>
     <div>${showLabels(modal.labels)}</div>
    <p class="text-gray-500">Some description</p>
    <div class="bg-gray-100 shadow-md mx-auto flex px-[30px] py-[10px] rounded-md gap-[60px]">
      <div class="">
        <p class="text-grey-500">Asignee:</p>
        <p class="font-bold">${modal.assignee? modal.assignee.replace("_"," ").toUpperCase(): "no one assigned"}</p>
      </div>
      <div>
        <p class="text-grey-500">Priority</p>
        <div class="badge badge-error">${modal.priority}</div>
      </div>
    </div>
    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-primary">Close</button>
      </form>
    </div>

    `
    document.getElementById("my_modal").showModal();

}
SearchInput.addEventListener("input",(event)=>{
    const inputTxt=event.target.value.trim();
    if(inputTxt.length>0){
        SearchBox(inputTxt);
    }
    else{
        DisplayIssues(allIssues);
    }
})
const SearchBox=(inputTxt)=>{
    url=` https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${inputTxt}`;
    fetch(url)
    .then(res=>res.json())
    .then(data=>{
        if(data.data){
        DisplayIssues(data.data)
        }
        })
            .catch(error=>{
                console.error("error found",error);
            
    })

}
AllBtn.addEventListener("click",()=>{
    toggleButton("all")
})
OpenBtn.addEventListener("click",()=>{
    toggleButton("open")
})
ClosedBtn.addEventListener("click",()=>{
    toggleButton("closed");
})
