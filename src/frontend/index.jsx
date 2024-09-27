import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Stack, Text, Box, Inline, Image, Strong, Heading, Button, ButtonGroup, Icon, Tooltip, Textfield, Badge, Lozenge } from '@forge/react';
import { invoke } from '@forge/bridge';
// import  images  from './'

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  const ExampleBox = () => {
    return (
      <Box
        xcss={{
          backgroundColor: 'color.background.discovery',
          borderRadius: 'border.radius',
          borderStyle: 'solid',
          borderWidth: 'border.width',
          borderColor: 'color.border.discovery',
          padding: 'space.200'
        }}
      />
    )
  }

  const LongBox = () => {
    return (
      <Box
        xcss={{
          backgroundColor: 'color.background.discovery',
          borderRadius: 'border.radius',
          borderStyle: 'solid',
          borderWidth: 'border.width',
          borderColor: 'color.border.discovery',
          padding: 'space.200',
          height: '120px'
        }}
      />
    )
  }

  return (
    <>
      {/* <Inline space="space.200">
      <Stack space="space.050" alignInline="center">
        <Box
          xcss={{
            backgroundColor: 'color.background.accent.lime.subtle.pressed',
            borderRadius: 'border.radius',
            borderStyle: 'solid',
            borderWidth: 'border.width',
            borderColor: 'color.border',
            padding: 'space.200'
          }}
        >
         <Text>Sotteri dashboard</Text>   


        </Box>
        <Box
          xcss={{
            backgroundColor: 'color.background.accent.red.subtle',
            borderRadius: 'border.radius',
            borderStyle: 'solid',
            borderWidth: 'border.width',
            borderColor: 'color.border',
            padding: 'space.200'
          }}
        >
         <Text>Sotteri dashboard</Text>   


        </Box>
      </Stack>
    </Inline>
    <Inline space="space.200">
      <Stack grow="hug">
      <Box
          xcss={{
            backgroundColor: 'color.background.accent.lime.subtle.pressed',
            borderRadius: 'border.radius',
            borderStyle: 'solid',
            borderWidth: 'border.width',
            borderColor: 'color.border',
            // padding: 'space.200',
            height: '80px',
            width: '80px'
          }}
        >
         <Text>Sotteri dashboard</Text>   


        </Box>
      </Stack>
      <Stack grow="fill">
        <ExampleBox>Available space is filled</ExampleBox>
      </Stack>
    </Inline> */}
      {/* ---------- */}
      {/* <Stack>
        <Box
          xcss={{
            backgroundColor: 'color.background.accent.lime.subtle.pressed',
            borderRadius: 'border.radius',
            borderStyle: 'solid',
            borderWidth: 'border.width',
            borderColor: 'color.border',
            padding: 'space.200'
          }}
        >
          <Inline>
            <Stack>
              <Box
                xcss={{
                  backgroundColor: 'color.background.accent.red.subtler',
                  borderRadius: 'border.radius',
                  borderStyle: 'solid',
                  borderWidth: 'border.width',
                  borderColor: 'color.border',
                  width: '80px',
                  height: '80px'
                }}

              >

              </Box>
            </Stack>
            <Stack space="space.050" alignBlock='center' alignInline="center" grow="fill">
              <ExampleBox />
            </Stack>
          </Inline>

          <Inline space="space.200" alignBlock="stretch">
            <Stack space="space.050" alignBlock="center">
              <ExampleBox />
              <ExampleBox />
            </Stack>
            <Box
              xcss={{
                height: '200px',
              }}
            />
          </Inline>
        </Box>
      </Stack> */}
      {/* -------- */}

      {/* <Inline space="space.200" alignBlock="stretch">
        <Stack space="space.050" alignBlock="center">
          <ExampleBox />
          <ExampleBox />
        </Stack>
        <Box
          xcss={{
            height: '200px',
          }}
        />
      </Inline>

      <Stack space="space.050" alignInline="center">
      <LongBox/>
      <ExampleBox />
      <ExampleBox />
    </Stack> */}

      {/* 1st part */}

      <Inline space="space.200" alignBlock='center'>
        <Stack>
          <Box xcss={{
            backgroundColor: 'color.background.discovery',
            borderRadius: 'border.radius',
            borderStyle: 'solid',
            borderWidth: 'border.width',
            borderColor: 'color.border',
            padding: 'space.200',
            height: '30px',
            width: '30px'
          }} />
        </Stack>
        <Stack>
          {/* <Box xcss={{
          padding: 'space.250',
          height: '80px',
          width: '300px',
           }}> */}
          <Heading as="h2" level="h600">Sotteri Dashboard</Heading>
          {/* </Box>   */}
        </Stack>
      </Inline>

      {/* 2nd part */}

      <Inline space="space.200" alignBlock='center'>
        <Stack grow="hug">
          <Heading as="h3" level="h600">Spaces</Heading>
        </Stack>
        <Stack grow="fill" alignInline='end'>
          <Box xcss={{ width: '80%' }}>
            <Inline alignInline='end' space='space.200'>
              <Tooltip content="Schedule scans for all spaces in this instance" position="bottom">
                <Button appearance="primary" iconBefore="vid-play" >Scan All</Button>
              </Tooltip>
              <Tooltip content="Download findings for all spaces to a CSV file" position="top">
                <Button>Export All Findings</Button>
              </Tooltip>
              <Tooltip content="Adjust Sotteri Security Settings" position="top">
                <Box xcss={{height: '80px'}}>
                  <Button>
                    <Box xcss={{padding: "space.050"}}>
                      <Icon glyph="settings" label="settings" size="medium" />
                    </Box>
                  </Button>
                </Box>
              </Tooltip>
              <Tooltip content="Documentation" position="top">
              <Box xcss={{height: '80px'}}>
                  <Button appearance='subtle'>
                    <Box xcss={{padding: "space.050"}}>
                      <Icon glyph="info" label="info" size="medium" />
                    </Box>
                  </Button>
                </Box>
              </Tooltip>
            </Inline>
          </Box>
        </Stack>
      </Inline>

      {/* 3rd part */}

      <Inline space="space.200" alignBlock='center'>
        <Box xcss={{ width: "20%" }}>
          <Textfield
            appearance="standard"
            placeholder="filter by space name"
          />
        </Box>
        <Box xcss={{
          width: "15%",
          backgroundColor: 'color.background.input.hovered',
          padding: 'space.100',
          // paddingInlineStart: 'space.0.75', 
          borderRadius: 'border.radius',
          borderStyle: 'solid',
          borderWidth: 'border.width',
          borderColor: 'color.border',

        }}>
          <Inline alignBlock="center" space="space.100">
            <Text>Spaces type:</Text>
            {/* <Box xcss={{minWidth: "120px", height: '20px', backgroundColor: "color.background.success", color: "color.text.accent.blue",  }}>
              <Text>All</Text>


            </Box> */}
            <Box>
              <Lozenge appearance="inprogress">In progress</Lozenge>
            </Box>
            <Button appearance='subtle' spacing='compact'>
              <Box>
                <Icon glyph="chevron-down" label="chevron-down" size="medium" />
              </Box>
            </Button>
            
          </Inline>
        </Box>

      </Inline>

      {/*4th part  */}


    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
