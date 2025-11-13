import React from "react";
import { useLoading } from "../../context/LoadingContext";

function Loading() {
  const { loading } = useLoading();

  if (!loading) return null;
  return (
    <>
      <style>
        {`
                    #LoadingPanel, #LoginPanel {
                        text-align: center;
                        height: 100%;
                        width: 100%;
                        position: fixed;
                        z-index: 999999;
                        {/* background-color: rgba(0,0,0,.4); */}
                        opacity: 1;
                        top: 0;
                    }
                    
                    #LoadingPanel .no-freeze-spinner .spinner--container, #LoginPanel .no-freeze-spinner .spinner--container {
                        width: 100%;
                        height: 100%;
                    }

                    #LoadingPanel .no-freeze-spinner, #LoginPanel .no-freeze-spinner {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        border-radius: 50%;
                        width: 78px;
                        height: 78px;
                        padding: 7px;
                        //background: rgba(62,171,56,.75);
                        background: #0090da;
                        z-index: 999999;
                    }

                    #LoadingPanel .no-freeze-spinner .spinner--container i:nth-of-type(1), #LoginPanel .no-freeze-spinner .spinner--container i:nth-of-type(1) {
                        animation: loadicons 2s infinite ease-in-out;
                    }

                    #LoadingPanel .no-freeze-spinner .spinner--container i:nth-of-type(2), #LoginPanel .no-freeze-spinner .spinner--container i:nth-of-type(2) {
                        animation: loadicons 2s 1s infinite ease-in-out;
                    }

                    #LoadingPanel .no-freeze-spinner .spinner--container i, #LoginPanel .no-freeze-spinner .spinner--container i {
                        font-size: 24px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        z-index: 999999;
                        color: #fff;
                        width: 24px;
                        height: 24px;
                        line-height: 1;
                        transform: scale(0) translate3d(0,0,0);
                    }

                    #LoadingPanel .no-freeze-spinner .spinner--container>div, #LoginPanel .no-freeze-spinner .spinner--container>div {
                        animation-play-state: running;
                        border: 3px solid #fff;
                        border-radius: 100%;
                        animation: rotate 1s linear infinite;
                        border-left-color: transparent;
                        width: 100%;
                        height: 100%;
                    }

                    @keyframes rotate {
                    0% {
                            -webkit-transform: rotate(0deg);
                            transform: rotate(0deg);
                        }

                        100% {
                            -webkit-transform: rotate(360deg);
                            transform: rotate(360deg);
                        }
                    }
                        
                    @keyframes loadicons {
                        0% {
                            transform: scale(1.2) translate3d(0,0,0);
                        }

                        11% {
                            transform: scale(1.2) translate3d(0,0,0);
                        }
                        22% {
                            transform: scale(1) translate3d(0,0,0);
                        }
                        33% {
                            transform: scale(0) translate3d(0,0,0);
                        }
                    }

                        `}
      </style>
      <div id="LoadingPanel">
        <div className="no-freeze-spinner">
          <div className="spinner--container">
            <i className="mdi mdi-basket"></i>
            <i className="mdi mdi-account-search"></i>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Loading;
