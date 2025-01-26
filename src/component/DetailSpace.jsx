import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalTransition,
  ModalTitle,
  ModalFooter,
  ModalHeader,
  Box,
  Stack,
  Text,
  Inline,
  Tooltip,
  Strong,
  Button,
  Select,
  Toggle,
  DatePicker,
  Label,
  Textfield,
  Icon,
  Heading,
} from "@forge/react";

const DetailSpace = ({ isOpens, setIsOpen }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [chevronDropDonwn, setChevronDropDown] = useState(false);

  const closeModal = () => setIsOpen(false);

  const handleSensitiveReviwed = () => {
    console.log("handles");
    setChevronDropDown(pre => !pre);
  };

  return (
    <>
      {/* <Button appearance="primary" onClick={openModal}>
        Open modal
      </Button> */}

      <ModalTransition>
        {isOpens && (
          <Modal
            onClose={closeModal}
            shouldScrollInViewport={false}
            width={"75%"}
            height={"95%"}>
            <ModalHeader>
              <Box xcss={{ width: "98%" }}>
                <Inline spread="space-between" alignBlock="center">
                  <Stack>
                    <Inline space="space.200" alignBlock="center">
                      <Stack>
                        <Box
                          xcss={{
                            backgroundColor: "color.background.discovery",
                            borderRadius: "border.radius",
                            borderStyle: "solid",
                            borderWidth: "border.width",
                            borderColor: "color.border",
                            padding: "space.200",
                            height: "50px",
                            width: "50px",
                          }}
                        />
                      </Stack>
                      <Stack>
                        <Heading as="h2" level="h600">
                          Sotteri Analysis
                        </Heading>
                        <Inline alignBlock="center">
                          <Box
                            xcss={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "border.radius",
                              backgroundColor:
                                "color.background.accent.red.bolder.pressed",
                            }}>
                            {/* <Image
                        // src={`${baseUrl}${president.icon.path}`}
                        // alt={`Avatar of ${president.authorId}`}
                        style={{ width: "100%", height: "100%" }}
                      /> */}
                          </Box>

                          <Box
                            xcss={{
                              // paddingInline: "space.200",
                              color: "color.text.selected",
                            }}>
                            <Button appearance="subtle">
                              <Text>
                                Himmad Ameen
                                {/* <Button> */}
                                {/* <Link href={`${baseUrl}/${president.name}`} openNewTab="true">{president.name}</Link> */}
                                {/* {president.name} */}
                                {/* <Link href="https://atlassian.com">
                      {president.name}
                    </Link> */}
                                {/* </Button> */}
                              </Text>
                            </Button>
                          </Box>
                        </Inline>
                      </Stack>
                    </Inline>
                  </Stack>
                  <Stack>
                    <Box xcss={{ width: "80%" }}>
                      <Inline alignBlock="center" space="space.200">
                        <Tooltip content="Documentation" position="top">
                          <Box xcss={{ height: "30px" }}>
                            <Button appearance="subtle">
                              <Box xcss={{ padding: "space.0" }}>
                                <Icon glyph="info" label="info" size="medium" />
                              </Box>
                            </Button>
                          </Box>
                        </Tooltip>
                        <Tooltip
                          content="Download findings for all this space to a CSV file"
                          position="bottom">
                          <Button>Export All Findings</Button>
                        </Tooltip>
                        <Tooltip
                          content="Scans for this space"
                          position="bottom">
                          <Button
                            appearance="primary"
                            //   iconBefore="vid-play"
                            //   isLoading={allScanLoading}
                            //   onClick={handleSpaceScanAll}
                          >
                            Scan Space
                          </Button>
                        </Tooltip>
                      </Inline>
                    </Box>
                  </Stack>
                </Inline>
              </Box>
            </ModalHeader>
            <ModalBody>
              {/* 1st part */}
              <Box xcss={{ width: "98%" }}>
                <Inline spread="space-between" alignBlock="center">
                  <Stack>
                    <Inline space="space.100" alignBlock="center">
                      <Box xcss={{ width: "16rem" }}>
                        <Select
                          appearance="default"
                          isMulti
                          isSearchable={false}
                          placeholder="Select Page"
                          options={[
                            { label: "Apple", value: "a" },
                            { label: "Banana", value: "b" },
                          ]}
                        />
                      </Box>
                      <Inline>
                        <Tooltip content="Documentation" position="bottom">
                          <Inline alignBlock="center">
                            <Label>Auto Scan</Label>
                            <Icon
                              glyph="editor-success"
                              label="success"
                              primaryColor="color.icon.success"
                              size="large"
                            />
                          </Inline>
                        </Tooltip>
                      </Inline>
                    </Inline>
                  </Stack>
                  <Stack>
                    <Inline alignBlock="center">
                      <Label labelFor="toggle">Show Reviewed: </Label>
                      <Toggle
                        id="toggle"
                        onChange={() => setIsChecked((prev) => !prev)}
                        isChecked={isChecked}
                        size="large"
                      />
                    </Inline>
                  </Stack>
                </Inline>
              </Box>

              {/* border */}
              <Box
                xcss={{
                  width: "100%",
                  height: "1px",
                  borderStyle: "solid",
                  borderWidth: "border.width",
                  borderColor: "color.border.accent.gray",
                  marginBlock: "space.150",
                  //   backgroundColor: "color.background.accent.gray.subtle",
                }}></Box>

              {/* Sensitive data listing */}
              <Box
                xcss={{
                  width: "100%",
                  marginBlock: "space.200",
                  borderStyle: "solid",
                  borderWidth: "border.width",
                  borderColor: "color.border.disabled",
                  borderRadius: "border.radius",
                  backgroundColor: "color.background.input.hovered",
                  //   paddingBlock: "space.100",
                  paddingInline: "sapce.150",
                  alignBlock: "center",
                }}>
                <Box
                  xcss={{
                    borderStyle: "none", // Removes border
                    padding: "0", // Ensure button fits the container
                    height: "4rem",
                    alignBlock: "center",
                  }}>
                  <Button
                    shouldFitContainer
                    onClick={() => handleSensitiveReviwed()}>
                    <Inline
                      alignBlock="center"
                      spread="space-between"
                      space="space.100">
                      <Stack spread="space-between">
                        <Inline alignBlock="center" space="space.100">
                          <Icon
                            glyph={
                              chevronDropDonwn
                                ? "chevron-down"
                                : "chevron-right"
                            }
                            label={
                              chevronDropDonwn
                                ? "chevron-down"
                                : "chevron-right"
                            }
                            // primaryColor="color.icon.success"
                            size="medium"
                          />
                          <Box
                            xcss={{
                              width: "maxContent",
                              backgroundColor:
                                "color.background.neutral.pressed",
                              padding: "space.050",
                              borderStyle: "solid",
                              borderWidth: "border.width",
                              borderColor: "color.border.disabled",
                              borderRadius: "border.radius",
                              color: "color.text.subtle",
                              fontStyle: "font.weight.regular",
                            }}>
                            <Text>
                              <Strong>Credit Card Numbers</Strong>
                            </Text>
                          </Box>

                          <Box
                            xcss={{
                              color: "color.text.subtlest",
                              fontWeight: "font.weight.medium",
                            }}>
                            <Text>
                              <Strong>Sensitive Pages in Personal</Strong>
                            </Text>
                          </Box>
                        </Inline>
                      </Stack>
                      <Stack space="space.050">
                        <Inline alignBlock="center" space="space.150">
                          <Box
                            xcss={{
                              backgroundColor:
                                "color.background.accent.green.bolder.hovered",
                              borderStyle: "solid",
                              borderWidth: "border.width",
                              borderColor: "color.border.disabled",
                              borderRadius: "border.radius",
                              color: "color.text.inverse",
                            }}>
                            <Text>REVIEWED</Text>
                          </Box>
                          <Box>
                            <Tooltip
                              content="Mark this Finding as reviewed, e.g. as a false positive or revoked crednetial."
                              position="bottom">
                              <Button appearance="warning">
                                Warning button
                              </Button>
                            </Tooltip>
                          </Box>
                        </Inline>
                      </Stack>
                    </Inline>
                  </Button>
                </Box>
              </Box>

              {/* <Box
                xcss={{
                  width: "80%",
                  height: "4rem",
                  paddingBlock: "20px",
                  backgroundColor:
                    "color.background.accent.yellow.subtlest.pressed",
                }}>
                <Button appearance="primary" shouldFitContainer type="submit">
                  Scannnning .....
                </Button>
              </Box> */}
            </ModalBody>
            <ModalFooter>
              <Button appearance="primary" onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
};

export default DetailSpace;
