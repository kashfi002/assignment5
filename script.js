const IssueContainer=document.getElementById("issue-card-container");
const LoadingSpinner=document.getElementById("loadingSpinner");
const Navbar=document.getElementById("navbar");
const IssuesType=document.getElementById("issues-type");
const IssuesCounter=document.getElementById("issues-counter");
const MainPart=document.getElementById("main-part")
const showLoading=()=>{
    LoadingSpinner.classList.remove("hidden")
    LoadingSpinner.classList.add("flex");
    MainPart.classList.add("hidden");
}
const hideLoading=()=>{
     LoadingSpinner.classList.add("hidden");
     MainPart.classList.remove("hidden");
}

async function LoadIssues() {
    showLoading();
    const res=await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    const data=await res.json();
    hideLoading();
    console.log(data);
     DisplayIssues(data.data);
}
const DisplayIssues=(issues)=>{
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
        issueCard.innerHTML=`
        <div class="shadow-md rounded-md border-t-4 ${bordercolor} p-[10px]">
    <div class="flex justify-between">
      <img src="${statusImg}" alt="">
      <div class="badge badge-soft badge-warning ${topBatchText} ${topBatchBg}">${element.priority}</div>
    </div>
    <h4 class="font-semibold">${element.title}</h4>
    <p class="line-clamp-2">${element.description}</p>
    <div class="my-[10px]">
    <div class="badge badge-soft badge-error">Error</div>
    <div class="badge badge-soft badge-warning">Bug found</div>
    </div>
    <hr>
    <p class="text-gray-500"># ${element.id} by ${element.author}</p>
    <p class="text-gray-500">${element.createdAt}</p>
  </div>
        `
        IssueContainer.appendChild(issueCard);
    });
}
LoadIssues();