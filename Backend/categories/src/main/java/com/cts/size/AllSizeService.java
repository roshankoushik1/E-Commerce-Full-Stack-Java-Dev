package com.cts.size;

import java.util.List;

public interface AllSizeService {
    AllSize saveSize(AllSize size);
    List<AllSize> getAllSizes();
}