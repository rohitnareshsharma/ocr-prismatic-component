import { action, component, input } from "@prismatic-io/spectral";
import axios from "axios";


const ocrAction = action({
  // This is what the action should look like in the integration designer
  display: {
    label: "OCR",
    description: "Expects users to complete document scanning",
  },
  // This action should have these inputs
  inputs: {
    executionId: input({
      label: "Execution ID",
      type: "string",
      required: true,
    })
  },
  // When run, this action should execute this function
  perform: async (context, params) => {
    const executionId = `${params.executionId}`;
    context.logger.info("Execution Id is :", executionId);
    let resultString;
 
    context.logger.info("Awaiting for results");
    // Lets runs a loop
    for(let i = 0; i<30; i++) {
      await sleep(10000);
      resultString = await getResults(executionId);
      if(resultString) {
        break;
      }  
    }

    if(resultString) {
      context.logger.info("Result is obtained :", resultString);
      return Promise.resolve({ data: resultString });  
    } else {
      context.logger.error("Got no results sorry");
      throw new Error("Step failed");
    }
    // Promise.resolve because perform functions are async

  },
});

async function getResults(key:String) {
  const url = `https://kvdb.io/7hWSiammtFLGCyKLe2iEs7/OCR-${key}`; // Replace with your API endpoint
  const customHeader = 'Bearer 4cfe3342-1641-4e40-8646-85ada267c5de'; // Replace with your desired header value

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': customHeader
      }
    });

    // Handle the response data here
    console.log(response.data);
    return response.data;
  } catch (error) {
    // Handle errors here
  }
}

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default component({
  key: "ocrComponent",
  public: false,
  display: {
    label: "OCR",
    description: "A component representing scanning of document through one sdk",
    iconPath: "icon.png",
    category: "UI"
  },
  actions: { ocrAction }
});
