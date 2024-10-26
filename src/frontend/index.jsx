import React, { useEffect, useState } from 'react';
import ForgeReconciler, { useProductContext, Stack, Text, Box, Inline, Image, Strong, Heading, Button, ButtonGroup, Icon, Tooltip, Textfield, Badge, Lozenge, DynamicTable, Link, Select, RadioGroup, Radio, Spinner, Label, TimePicker } from '@forge/react';
import { invoke, requestConfluence } from "@forge/bridge";
import api, { route, fetch } from "@forge/api";
import { requireSafeUrl } from '@forge/api/out/safeUrl';
import ModalPops from '../component/modalPop';

const App = () => {
  const [data, setData] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [scanAllPages, setScanAllPages] = useState([]);
  const [url, setUrl] = useState(null);
  const [baseUrl, setBaseUrl] = useState(null);
  const [basedUrl, setBasedUrl] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [selectedSpaceType, setSelectedSpaceType] = useState('In progress');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownVisibleOnPage, setIsDropdownVisibleOnPage] = useState(false);
  const [isCheckedString, setIsCheckedString] = useState('all');
  const [loading, setLoading] = useState(true);
  const [allScanLoading, setAllScanLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [spaceCount, setSpaceCount] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpens, setModalOpens] = useState(false);
  const [scheduledConfirm, setScheduledConfirm] = useState(false);
  const context = useProductContext();

  const spaceResponse = async () => {
    setLoading(true)
    try {
      const res = await requestConfluence(`/wiki/api/v2/spaces?sort=name&include-icon=true&limit=250&_r=1727785683494`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await res.json();
      // console.log('Formatted Response:', JSON.stringify(data.results, null, 2));

      setSpaces(data.results);
      setFilteredSpaces(data.results);

      const initialCounts = data.results.reduce((acc, space) => {
        acc[space.id] = 0;
        return acc;
      }, {});
      setSpaceCount(initialCounts);

      const cleanedBaseUrl = data._links.base.replace('/wiki', '');
      setBaseUrl(cleanedBaseUrl);
      handleSpaceScanAll()
    } catch (error) {
      console.error('Error fetching spaces:', error);
    } finally {
      setLoading(false);
    }
  };


  // const pageResponse = async (bodyType) => {
  //   const res = await requestConfluence(`/wiki/api/v2/pages?body-format=${bodyType}`, {
  //     headers: {
  //       'Accept': 'application/json'
  //     }
  //   })

  //   const data = await res.json();
  //   // setPages(data.results);
  //   const storages = data?.results || "";
  //   const sens = storages.map((item) => item.body?.atlas_doc_format?.value);
  //   // const sensitiveDataResults = sensitiveData(sens);
  //   // console.log('result', sensitiveDataResults);
  //   // console.log("on scann all", data.results)
  // }

  // const spacePageResponse = async (id, bodyType) => {
  //   const res = await requestConfluence(`/wiki/api/v2/spaces/${id}/pages?body-format=${bodyType}`, {
  //     headers: {
  //       'Accept': 'application/json'
  //     }
  //   })

  //   const datas = await res.json();
  //   const storages = datas?.results || "";
  //   // console.log('Formatted Response:', JSON.stringify(datas.results, null, 2));
  //   // console.log('Formatted Response --->:', storages.map((item) => item.title));
  //   console.log('Formatted Response <--->:', storages.map((item) => item.body?.atlas_doc_format?.value));
  //   const sens = storages.map((item) => item.body?.atlas_doc_format?.value);
  //   const sensitiveDataResults = sensitiveData(sens);
  //   console.log('result', sensitiveDataResults);
  //   setSpaceCount(sensitiveDataResults.totalCount);
  //   // setPages(data.results);
  // }

  // const initializeSpaceCount = () => {
  //   const initialCounts = filteredSpaces.reduce((acc, president) => {
  //     acc[president.id] = 0;
  //     return acc;
  //   }, {});
  //   return initialCounts;
  // };

  // console.log("-->", initializeSpaceCount)
  // const [spaceCount, setSpaceCount] = useState(initializeSpaceCount);

  const pageResponse = async (bodyType) => {
    setAllScanLoading(true)
    try {
      const res = await requestConfluence(`/wiki/api/v2/pages?body-format=${bodyType}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await res.json();
      const storages = data?.results || [];

      // Scan sensitive data for each page and store it based on spaceId
      const resultsBySpaceId = {};
      for (const item of storages) {
        const spaceId = item.spaceId; // Get the spaceId from the item
        const pageContent = item.body?.atlas_doc_format?.value || "";

        const sensitiveDataResults = sensitiveData([pageContent]);

        // Store the sensitive data count for each spaceId
        if (!resultsBySpaceId[spaceId]) {
          resultsBySpaceId[spaceId] = {
            totalCount: 0,
            sensitiveValues: []
          };
        }

        resultsBySpaceId[spaceId].totalCount += sensitiveDataResults.totalCount;
        resultsBySpaceId[spaceId].sensitiveValues.push(...sensitiveDataResults.sensitiveValues);
      }

      // Update the space count with the sensitive data count for each spaceId
      Object.entries(resultsBySpaceId).forEach(([spaceId, result]) => {
        handleSpaceCountUpdate(spaceId, result.totalCount);
      });

      console.log("Sensitive data by spaceId", resultsBySpaceId);
    } catch (error) {
      console.error("Error fetching pages or processing sensitive data:", error);
    } finally {
      setAllScanLoading(false)
    }
  };

  // const spacePageResponse = async (id, bodyType) => {
  //   setLoadingStates((prev) => ({ ...prev, [id]: true }));

  //   try {
  //     const res = await requestConfluence(`/wiki/api/v2/spaces/${id}/pages?body-format=${bodyType}`, {
  //       headers: {
  //         'Accept': 'application/json'
  //       }
  //     });

  //     const datas = await res.json();
  //     const storages = datas?.results || "";
  //     const sens = storages.map((item) => item.body?.atlas_doc_format?.value);
  //     const sensitiveDataResults = sensitiveData(sens);
  //     console.log('result', sensitiveDataResults, sens);
  //     // setSpaceCount(sensitiveDataResults.totalCount);
  //     handleSpaceCountUpdate(id, sensitiveDataResults.totalCount);
  //   } catch (error) {
  //     console.error("Error fetching space page response:", error);
  //   } finally {
  //     setLoadingStates((prev) => ({ ...prev, [id]: false }));
  //   }
  // }

  // const spacePageResponse = async (id, bodyType) => {
  //   setLoadingStates((prev) => ({ ...prev, [id]: true }));

  //   try {
  //     const res = await requestConfluence(`/wiki/api/v2/spaces/${id}/pages?body-format=${bodyType}`, {
  //       headers: {
  //         'Accept': 'application/json'
  //       }
  //     });

  //     const datas = await res.json();
  //     const storages = datas?.results || [];

  //     // console.log("pages", storages)
  //     // const pageIdsSet = new Set();  // To track unique page IDs
  //     // const sens = [];

  //     // storages.forEach((item) => {
  //     //   if (!pageIdsSet.has(item.id)) {  // Ensure unique page processing by ID
  //     //     pageIdsSet.add(item.id);
  //     //     const content = item.body?.atlas_doc_format?.value;
  //     //     sens.push(content);
  //     //   }
  //     // });

  //     // const sensitiveDataResults = sensitiveData(sens);  // Process the filtered data

  //     // console.log('result', sensitiveDataResults, sens);

  //     // handleSpaceCountUpdate(id, sensitiveDataResults.totalCount); // Update count

  //     // Scan sensitive data for each page and store it based on spaceId
  //     const resultsBySpaceId = {};
  //     for (const item of storages) {
  //       const spaceId = item.id;
  //       const pageContent = item.body?.atlas_doc_format?.value || "";

  //       const sensitiveDataResults = sensitiveData([pageContent]);

  //       // Store the sensitive data count for each spaceId
  //       if (!resultsBySpaceId[spaceId]) {
  //         resultsBySpaceId[spaceId] = {
  //           totalCount: 0,
  //           sensitiveValues: []
  //         };
  //       }

  //       resultsBySpaceId[spaceId].totalCount += sensitiveDataResults.totalCount;
  //       resultsBySpaceId[spaceId].sensitiveValues.push(...sensitiveDataResults.sensitiveValues);
  //     }

  //     // Update the space count with the sensitive data count for each spaceId
  //     Object.entries(resultsBySpaceId).forEach(([id, result]) => {
  //       handleSpaceCountUpdate(id, result.totalCount);
  //     });

  //     console.log("Sensitive data by spaceId", resultsBySpaceId);

  //   } catch (error) {
  //     console.error("Error fetching space page response:", error);
  //   } finally {
  //     setLoadingStates((prev) => ({ ...prev, [id]: false }));
  //   }
  // };

  const spacePageResponse = async (id, bodyType) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await requestConfluence(`/wiki/api/v2/spaces/${id}/pages?body-format=${bodyType}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      const datas = await res.json();
      const storages = datas?.results || [];

      let cumulativeTotalCount = 0;
      const cumulativeSensitiveValues = [];

      for (const item of storages) {
        const pageContent = item.body?.atlas_doc_format?.value || "";

        const sensitiveDataResults = sensitiveData([pageContent]);

        cumulativeTotalCount += sensitiveDataResults.totalCount;
        cumulativeSensitiveValues.push(...sensitiveDataResults.sensitiveValues);
      }

      handleSpaceCountUpdate(id, cumulativeTotalCount);

      console.log(`Sensitive data for space ID ${id}:`, {
        totalCount: cumulativeTotalCount,
        sensitiveValues: cumulativeSensitiveValues
      });

    } catch (error) {
      console.error("Error fetching space page response:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSpaceCountUpdate = (id, count) => {
    setSpaceCount((prevCounts) => ({
      ...prevCounts,
      [id]: count,
    }));
  };

  useEffect(() => {
    spaceResponse();
  }, []);

  useEffect(() => {
    if (baseUrl) {
      setBasedUrl(baseUrl)
    }
  }, [baseUrl]);

  const createKey = (input) => {
    return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
  }

  const toggleDropdownOnScan = (spaceIds) => {
    console.log("ids", spaceIds)
    spacePageResponse(spaceIds, "atlas_doc_format")
  }

  const handleSpaceScanAll = () => {
    pageResponse("atlas_doc_format")
    // setAllScanLoading(true);
  }

  const toggleDropdownOnExport = (rKey) => {

  }

  const handleCloseDropdown = () => {
    setActiveRow(null);
  };


  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Handle option selection
  const handleSelection = (option) => {
    setSelectedSpaceType(option.label);
    setIsDropdownVisible(false);
  };

  const options = [
    { name: 'color', value: 'All', label: 'Show all Spaces' },
    { name: 'color', value: 'Normal', label: 'Show normal Spaces' },
    { name: 'color', value: 'Personal', label: 'Show personal Spaces' },
  ];

  const handleRadio = (e) => {
    setIsCheckedString(e.target.value);
  }

  const handleFilter = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = spaces.filter((space) =>
      space.name.toLowerCase().includes(query)
    );

    setFilteredSpaces(filtered);
  }

  const sensitiveData = (contents) => {

    const patterns = {
      phoneNumber: {
        regex: /\b\+?(\d{1,4})[-.\s]?(\d{10,12})\b/g,
        name: "Phone Number"
      },
      emailAddress: {
        regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g,
        name: "Email Address"
      },
      ipv6Address: {
        regex: /\b(?:[0-9a-fA-F]{1,4}:){7}(?:[0-9a-fA-F]{1,4}|:)\b/g,
        name: "IPv6 Address"
      },
      usPassport: {
        regex: /\b\d{9}\b/g,
        name: "US Passport"
      },
      ukNationalInsurance: {
        regex: /\b[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]\b/g,
        name: "UK National Insurance"
      },
      canadianSIN: {
        regex: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{3}\b/g,
        name: "Canadian SIN"
      },
      vatNumber: {
        regex: /\b[A-Z]{2}[A-Z0-9]{8,12}\b/g,
        name: "VAT Number"
      },
      bitcoinAddress: {
        regex: /\b(?:1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}\b/g,
        name: "Bitcoin Address"
      },
      jwtToken: {
        regex: /\b[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\b/g,
        name: "JWT Token"
      },
      usDrivingLicense: {
        regex: /\b[A-Z0-9]{8,10}\b/g,
        name: "US Driving License"
      },
      vin: {
        regex: /\b[A-HJ-NPR-Z0-9]{17}\b/g,
        name: "Vehicle Identification Number (VIN)"
      },
      nationalID: {
        regex: /\b[A-Z0-9]{2}\d{10}\b/g,
        name: "National ID"
      },
      iban: {
        regex: /\b[A-Z]{2}\d{2}[A-Z\d]{1,30}\b/g,
        name: "IBAN"
      },
      generalPassport: {
        regex: /\b([A-Z]{1}[0-9]{7,8}|[A-Z]{2}[0-9]{7,9})\b/g,
        name: "General Passport"
      },
      socialSecurityNumber: {
        regex: /\b\d{3}-\d{2}-\d{4}\b/g,
        name: "Social Security Number (SSN)"
      },
      // creditCard: {
      //   regex: /\b(?:4[0-9]{3}(?:\s?[0-9]{4}){2,3}|5[1-5][0-9]{2}(?:\s?[0-9]{4}){3}|3[47][0-9]{2}(?:\s?[0-9]{6}\s?[0-9]{5}))\b/g,
      //   name: "Credit Card"
      // },
      visaCreditCard: {
        regex: /\b(?:4[0-9]{3}(?:\s?[0-9]{4}){2,3})\b/g,
        name: "Visa Credit Card"
      },
      masterCreditCard: {
        regex: /\b(?:5[1-5][0-9]{2}(?:\s?[0-9]{4}){3})\b/g,
        name: "Master Credit Card"
      },
      americanExpressCard: {
        regex: /\b(?:3[0-9]{3}(?:\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{3,4}))\b/g,
        name: "American Express Card"
      },
      indianAadhaarNumber: {
        regex: /\b([2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4})\b/g,
        name: "Indian Aadhaar Number"
      },
      passportNumber: {
        regex: /\b([A-Z]{1}\d{7}|[A-Z]{2}\d{7,9})\b/g,
        name: "Passport Number"
      }
    };

    let totalCount = 0;
    const sensitiveValues = new Set();
    const matchedValues = new Set();

    contents.forEach((contentString, index) => {
      try {
        const contentObj = JSON.parse(contentString);
        const extractedText = extractTextFromContent(contentObj.content);

        extractedText.forEach((text) => {
          Object.values(patterns).forEach((patternObj) => {
            const matches = text.match(patternObj.regex);
            if (matches) {
              matches.forEach(match => {
                // Check if this value has already been matched
                if (!matchedValues.has(match)) {
                  // Add to the matched values to prevent overlap
                  matchedValues.add(match);
                  sensitiveValues.add(JSON.stringify({ type: patternObj.name, value: match }));
                  totalCount++;
                }
              });
            }
          });
        });
      } catch (error) {
        console.error(`Error parsing JSON content at index ${index}:`, error);
      }
    });

    // Convert Set back to Array and parse JSON strings
    const uniqueSensitiveValues = Array.from(sensitiveValues).map(item => JSON.parse(item));
    return {
      totalCount,
      sensitiveValues: uniqueSensitiveValues
    };
  };

  const extractTextFromContent = (contentArray) => {
    let textContents = [];

    contentArray.forEach((contentItem) => {
      // Extract from paragraphs
      if (contentItem.type === "paragraph" && contentItem.content) {
        contentItem.content.forEach((textItem) => {
          if (textItem.type === "text" && textItem.text) {
            textContents.push(textItem.text);
          }
        });
      }

      // Extract from bullet lists
      if (contentItem.type === "bulletList" && contentItem.content) {
        contentItem.content.forEach((listItem) => {
          if (listItem.type === "listItem" && listItem.content) {
            listItem.content.forEach((paragraphItem) => {
              if (paragraphItem.type === "paragraph" && paragraphItem.content) {
                paragraphItem.content.forEach((textItem) => {
                  if (textItem.type === "text" && textItem.text) {
                    textContents.push(textItem.text);
                  }
                });
              }
            });
          }
        });
      }

      // Extract from ordered lists
      if (contentItem.type === "orderedList" && contentItem.content) {
        contentItem.content.forEach((listItem) => {
          if (listItem.type === "listItem" && listItem.content) {
            listItem.content.forEach((paragraphItem) => {
              if (paragraphItem.type === "paragraph" && paragraphItem.content) {
                paragraphItem.content.forEach((textItem) => {
                  if (textItem.type === "text" && textItem.text) {
                    textContents.push(textItem.text);
                  }
                });
              }
            });
          }
        });
      }
    });

    return textContents;
  };

  const rows = loading
    ? [
      {
        key: 'loading-row',
        cells: [
          {
            key: 'spinner-cell',
            content: (
              <Stack
                alignBlock='center' alignInline='center'
              >
                <Box xcss={{ padding: "space.100" }}>
                  <Spinner size="medium" label="Loading..." />
                </Box>
              </Stack>
            ),
            colSpan: 4,
          },
        ],
      },
    ]
    : filteredSpaces.map((president, index) => {
      const rowKey = `row-${index}-${president.name}`;
      const countValue = spaceCount[president.id] ?? 0;
      console.log("in counts", countValue)
      return {
        key: rowKey,
        cells: [
          {
            key: createKey(president.name),
            content: (
              <Inline alignBlock='center'>
                <Box xcss={{
                  width: '35px',
                  height: '35px',
                  borderRadius: 'border.radius',
                }}>
                  <Image
                    src={`${baseUrl}${president.icon.path}`}
                    alt={`Avatar of ${president.authorId}`}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Box>

                <Box xcss={{ paddingInline: 'space.200', color: 'color.text.selected' }}>
                  <Text>
                    <Link href="" openNewTab="true">{president.name}</Link>
                  </Text>
                </Box>
              </Inline>
            ),
          },
          {
            key: createKey(president.findings),
            content: (
              <Stack alignInline='center'>
                <Box xcss={{ width: '25px' }}>
                  <Stack alignInline='center'>
                    <Box xcss={{ backgroundColor: "color.background.accent.green.subtlest", width: "60px", padding: "space.50" }}>
                      <Stack alignInline="center" alignBlock="center">
                        <Box>
                          {countValue > 0 ?
                            <Text>{countValue}</Text>
                            :
                            <Text> 0</Text>
                          }
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            ),
          },
          {
            key: createKey(president.scanStatus),
            content: (
              <Stack alignInline='center'>
                <Box xcss={{ backgroundColor: "color.background.accent.green.subtlest", width: "100px" }}>
                  <Stack alignInline='center'>
                    <Lozenge appearance="success">Up To Date</Lozenge>
                  </Stack>
                </Box>
              </Stack>
            ),
          },
          {
            key: createKey(president.actions),
            content: (
              <Stack alignBlock="center" alignInline="center" xcss={{ width: "100%" }}>
                <Box
                  xcss={{
                    width: "45%",
                    // display: "flex",
                    // justifyContent: "center",
                    // alignItems: "center",
                  }}
                >
                  <Inline spread="space-between" xcss={{ width: "90%" }}>
                    <Box>
                      {loadingStates[president.id] ? (
                        <Box xcss={{ backgroundColor: 'color.background.accent.gray.subtle.pressed', width: "80px", paddingBlock: "space.100", height: "30px" }}>
                          <Stack alignBlock="center" alignInline="center" >
                            <Spinner size="small" />
                          </Stack>
                        </Box>
                      ) : (
                        <Button appearance="default" iconBefore="vid-play" onClick={() => toggleDropdownOnScan(president.id)}>
                          Scan
                        </Button>
                      )}
                    </Box>
                    <Box>
                      <Button appearance="default" iconBefore="export" onClick={() => toggleDropdownOnExport(rowKey)}>
                        Export
                      </Button>
                    </Box>
                  </Inline>
                </Box>
              </Stack>
            )
          },
        ],

      };
    });

  const head = {
    cells: [
      {
        key: "name",
        content:
          (
            <Box xcss={{ paddingInline: "space.150" }}>
              <Text>Space Name</Text>
            </Box>
          ),
        isSortable: true,
        width: "40%"
      },
      {
        key: "findings",
        content: (
          <Stack alignInline='center'>
            <Tooltip content="Number of findings that haven't been reviewed marked" position="bottom">
              <Text>Findings</Text>
            </Tooltip>
          </Stack>
        ),
        shouldTruncate: true,
        isSortable: false,
        width: "20%"

      },
      {
        key: "scanStatus",
        content: (
          <Stack alignInline='center'>
            <Text>Scan Status</Text>
          </Stack>
        ),
        shouldTruncate: true,
        isSortable: false,
        width: "20%"

      },
      {
        key: "actions",
        content: (
          <Stack alignInline='center'>
            <Text>Actions</Text>
          </Stack>
        ),
        shouldTruncate: true,
        isSortable: false,
        width: "20%"
      },
    ],
  };

  const handleSchedule = () => {
    setModalOpens(true);
  }

  const completeScan = () => {
    sessionStorage.removeItem('scheduledScan');
    setScheduledConfirm(false);
  };

  const handleScheduleConfirm = (date, time) => {
    let normalizedTime = time.toUpperCase().replace(/\s+/g, '');
    const timePattern = /(\d{1,2})([:.]?(\d{2}))?(AM|PM)?/;
    const match = normalizedTime.match(timePattern);

    if (match) {
      let [hours, , minutes, period] = match.slice(1);
      minutes = minutes || '00';
      period = period || 'AM';
      normalizedTime = `${hours}:${minutes} ${period}`;
    } else {
      console.error("Invalid time format");
    }

    const scheduledDateTime = {
      date: date,
      time: normalizedTime,
    };
    sessionStorage.setItem('scheduledScan', JSON.stringify(scheduledDateTime));
    setScheduledConfirm(true);
  };

  const checkScheduledScan = () => {
    const scheduledScan = sessionStorage.getItem('scheduledScan');
    if (scheduledScan) {
      const { date, time } = JSON.parse(scheduledScan);

      const scheduledDateTime = new Date(`${date} ${time}`);

      const now = new Date();

      if (!isNaN(scheduledDateTime.getTime()) && now >= scheduledDateTime) {
        handleSpaceScanAll();
        completeScan();
      } else if (isNaN(scheduledDateTime.getTime())) {
        console.error("Invalid scheduled date and time:", scheduledDateTime);
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkScheduledScan, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {/* parent container */}

      <Stack alignBlock='center' alignInline='center'>
        <Box xcss={{ width: "75%", padding: "space.300" }}>

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
                height: '60px',
                width: '60px'
              }} />
            </Stack>
            <Stack>
              <Heading as="h2" level="h600">Sotteri Dashboard</Heading>
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
                  <Tooltip content="Schedule scans for all spaces in this instance" position="top">
                    <Button appearance={scheduledConfirm ? "subtle" : "primary"} iconBefore="schedule" isLoading={allScanLoading} isDisabled={scheduledConfirm} onClick={handleSchedule}>{scheduledConfirm ? 'Scheduled' : 'Schedule'}</Button>
                  </Tooltip>
                  {allScanLoading ?
                    <Box xcss={{
                      backgroundColor: 'color.background.accent.blue.bolder', borderRadius: 'border.radius',
                      borderStyle: 'solid',
                      borderWidth: 'border.width',
                      borderColor: 'color.border', width: "90px", paddingBlock: "space.100", height: "32px"
                    }}>
                      <Stack alignBlock="center" alignInline="center" >
                        <Spinner size="small" appearance="invert" />
                      </Stack>
                    </Box> :
                    <Tooltip content="Scans for all spaces in this instance" position="bottom">
                      <Button appearance="primary" iconBefore="vid-play" isLoading={allScanLoading} onClick={handleSpaceScanAll} >Scan All</Button>
                    </Tooltip>
                  }
                  <Tooltip content="Download findings for all spaces to a CSV file" position="top">
                    <Button>Export All Findings</Button>
                  </Tooltip>
                  <Tooltip content="Adjust Sotteri Security Settings" position="top">
                    <Box xcss={{ height: '80px' }}>
                      <Button>
                        <Box xcss={{ padding: "space.0" }}>
                          <Icon glyph="settings" label="settings" size="medium" />
                        </Box>
                      </Button>
                    </Box>
                  </Tooltip>
                  <Tooltip content="Documentation" position="top">
                    <Box xcss={{ height: '80px' }}>
                      <Button appearance='subtle'>
                        <Box xcss={{ padding: "space.0" }}>
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
            <Box xcss={{ width: "22%", backgroundColor: "color.background.accent.gray.subtlest.pressed" }}>
              <Textfield
                appearance="standard"
                placeholder="filter by space name"
                onChange={(e) => handleFilter(e)}
              />
            </Box>
            <Box xcss={{
              width: "20%",
              backgroundColor: 'color.background.input.hovered',
              padding: 'space.100',
              borderRadius: 'border.radius',
              borderStyle: 'none',
              borderWidth: 'border.width',
              borderColor: 'color.border',

            }}>
              <Inline alignBlock="center" space="space.100">
                <Text>Spaces type:</Text>
                <Box>
                  <Lozenge appearance="inprogress">{isCheckedString.toLocaleUpperCase()}</Lozenge>
                </Box>
                <Button appearance='subtle' spacing='compact' onClick={toggleDropdown}>
                  <Box>
                    <Icon glyph="chevron-down" label="chevron-down" size="medium" />
                  </Box>
                </Button>
              </Inline>
            </Box>
          </Inline>

          {/*4th part  */}

          <Inline>
            <Box xcss={{ width: "100%", paddingBlockStart: "space.300" }}>
              <DynamicTable
                caption=""
                head={head}
                rows={rows}
              />
            </Box>
          </Inline>

          {
            modalOpens &&
            <ModalPops isOpens={modalOpens} setIsOpen={setModalOpens} handleScheduled={handleScheduleConfirm} />
          }

        </Box>
      </Stack>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
